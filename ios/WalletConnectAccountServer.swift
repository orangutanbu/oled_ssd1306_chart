//
//  RNWalletConnect.swift
//  Uniswap
//
//  Created by Spencer Yen on 4/26/22.
//

import Foundation
import WalletConnectSwift

extension Session {
  func getAccount() -> String? {
    guard self.walletInfo != nil && !self.walletInfo!.accounts.isEmpty else {
      return nil
    }
    
    return self.walletInfo!.accounts[0]
  }
}

class WalletConnectServerWrapper {
  var eventEmitter: RCTEventEmitter!
  var server: Server!
  var supportedChainIds: [Int]!
  var settlePendingSession: ((Session.WalletInfo) -> Void)? = nil
  var topicToSession: [String: Session]! = [:]
  // mapping of internal id (uuid) => request
  private var pendingRequests: [String: Request]! = [:]
  
  init(eventEmitter: RCTEventEmitter, supportedChainIds: [Int]) {
    self.server = Server(delegate: self)
    self.eventEmitter = eventEmitter
    self.supportedChainIds = supportedChainIds
    
    self.server.register(handler: WalletConnectSignRequestHandler(eventEmitter: eventEmitter, serverWrapper: self))
    self.server.register(handler: WalletConnectSignTransactionHandler(eventEmitter: eventEmitter, serverWrapper: self))
    self.server.register(handler: WalletConnectSwitchChainHandler(eventEmitter: eventEmitter, serverWrapper: self, supportedChainIds: supportedChainIds))
  }
  
  func disconnect(_ topic: String) {
    guard let session = self.topicToSession[topic] else { return }
    
    do {
      try self.server.disconnect(from: session)
    } catch {
      self.eventEmitter.sendEvent(withName: EventType.error.rawValue, body: ["type": ErrorType.wcDisconnectError.rawValue, "message": error.localizedDescription, "account": session.getAccount()])
    }
  }
  
  func connect(to: WCURL) {
    do {
      try self.server.connect(to: to)
    } catch {
      self.eventEmitter.sendEvent(withName: EventType.error.rawValue, body: ["type": ErrorType.wcConnectError.rawValue, "message": error.localizedDescription])
    }
  }
  
  func settlePendingSession(chainId: Int, account: String, approved: Bool) throws -> Void {
    guard let completePendingSession = self.settlePendingSession else {
      throw WCSwiftError.pendingSessionNotFound
    }
    
    let walletMeta = Session.ClientMeta(name: "Uniswap Wallet",
                                        description: "Built by the most trusted team in DeFi, Uniswap Wallet allows you to maintain full custody and control of your assets.",
                                        icons: [URL(string:       "https://gateway.pinata.cloud/ipfs/QmR1hYqhDMoyvJtwrQ6f1kVyfEKyK65XH3nbCimXBMkHJg")!],
                                        url: URL(string: "https://uniswap.org/wallet")!)
    let walletInfo = Session.WalletInfo(approved: approved,
                                        accounts: [account],
                                        chainId: chainId,
                                        peerId: UUID().uuidString,
                                        peerMeta: walletMeta)
    completePendingSession(walletInfo)
    self.settlePendingSession = nil
  }
  
  func sendSignature(requestInternalId: String, signature: String) {
    guard let request = self.pendingRequests[requestInternalId] else {
      return self.eventEmitter.sendEvent(
        withName: EventType.error.rawValue,
        body: [
          "type": ErrorType.invalidRequestId.rawValue,
          "message": "Invalid request id",
        ]
      )
    }
    
    do {
      try self.server.send(Response(url: request.url, value: signature, id: request.id!))
    } catch {
      self.eventEmitter.sendEvent(
        withName: EventType.error.rawValue,
        body: [
          "type": ErrorType.wcSendSignatureError.rawValue,
        ]
      )
    }
    
    self.pendingRequests.removeValue(forKey: requestInternalId)
  }
  
  func requestSwitchChainId(request: Request, chainId: Int) {
    guard let session: Session = self.topicToSession[request.url.topic] else { return }
    
    guard supportedChainIds.contains(chainId) else {
      do {
        try self.server.send(Response(request: request, error: .requestRejected))
        
        let icons = session.dAppInfo.peerMeta.icons
        self.eventEmitter.sendEvent(withName: EventType.error.rawValue, body: [
          "type": ErrorType.wcUnsupportedChainError.rawValue,
          "account": session.getAccount(),
          "dapp": [
            "name": session.dAppInfo.peerMeta.name,
            "url": session.dAppInfo.peerMeta.url.absoluteString,
            "icon": icons.isEmpty ? "" : icons[0].absoluteString,
            "chain_id": chainId,
          ]
        ])
      } catch {
        self.eventEmitter.sendEvent(
          withName: EventType.error.rawValue,
          body: [
            "type": ErrorType.wcRejectRequestError.rawValue,
            "account": session.getAccount()
          ]
        )
      }
      
      return
    }
    
    switchChainId(session: session, chainId: chainId)
  }
  
  func switchChainId(session: Session, chainId: Int) {
    let w = session.walletInfo!
    let newWalletInfo = Session.WalletInfo(
      approved: w.approved, accounts: w.accounts, chainId: chainId, peerId: w.peerId, peerMeta: w.peerMeta)
    
    do {
      try self.server.updateSession(session, with: newWalletInfo)
      
      let icons = session.dAppInfo.peerMeta.icons
      
      self.eventEmitter.sendEvent(withName: EventType.networkChanged.rawValue, body: [
        "session_id": session.url.topic,
        "account": session.getAccount(),
        "dapp": [
          "name": session.dAppInfo.peerMeta.name,
          "url": session.dAppInfo.peerMeta.url.absoluteString,
          "icon": icons.isEmpty ? "" : icons[0].absoluteString,
          "chain_id": chainId
        ]
      ])
      
      // update session with updated chain ID in our local store
      var newSession = session
      newSession.walletInfo = newWalletInfo
      self.topicToSession.updateValue(newSession, forKey: session.url.topic)
      self.updateStoredSession(newSession)
    } catch {
      self.eventEmitter.sendEvent(
        withName: EventType.error.rawValue,
        body: [
          "type": ErrorType.wcSwitchChainError.rawValue,
          "account": session.getAccount()
        ]
      )
    }
  }
  
  func confirmSwitchChainRequest(requestInternalId: String) {
    guard let request = self.pendingRequests[requestInternalId] else {
      return self.eventEmitter.sendEvent(
        withName: EventType.error.rawValue,
        body: [
          "type": ErrorType.invalidRequestId.rawValue,
          "message": "Are you sure you are using request_internal_id and not request.id?"
        ]
      )
    }

    do {
      let session = try self.getSessionFromTopic(request.url.topic)
      let chainIdRequest = try request.parameter(of: WalletSwitchEthereumChainObject.self, at: 0)
      let chainId = try chainIdRequest.toInt()
    
      switchChainId(session: session, chainId: chainId)

      // TODO: Should be responding to wallet_switchEthereumChain requests with null based on https://eips.ethereum.org/EIPS/eip-3326, but Response requires non-null value
      try self.server.send(Response(url: request.url, value: chainId, id: request.id!))
    } catch {
      self.eventEmitter.sendEvent(
        withName: EventType.error.rawValue,
        body: [
          "type": ErrorType.wcSwitchChainError.rawValue,
        ]
      )
    }
    
    self.pendingRequests.removeValue(forKey: requestInternalId)
  }
  
  func rejectRequest(requestInternalId: String) {
    guard let request = self.pendingRequests[requestInternalId] else {
      return
    }
    
    do {
      try self.server.send(Response(request: request, error: .requestRejected))
    } catch {
      self.eventEmitter.sendEvent(
        withName: EventType.error.rawValue,
        body: [
          "type": ErrorType.wcRejectRequestError.rawValue,
        ]
      )
    }
    
    self.pendingRequests.removeValue(forKey: requestInternalId)
  }
  
  func setPendingRequest(request: Request, internalId: String) {
    self.pendingRequests.updateValue(request, forKey: internalId)
  }
  
  func getSessionFromTopic(_ topic: String) throws -> Session {
    guard let session = self.topicToSession[topic] else {
    