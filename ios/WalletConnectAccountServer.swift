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
                                        icons: [URL(string:       "https://gateway.pinata.cloud/