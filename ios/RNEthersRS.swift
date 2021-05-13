//
//  RNEthers.swift
//  Uniswap
//
//  Created by Connor McEwen on 10/28/21.

/**
 Provides the generation, storage, and signing logic for mnemonics and private keys so that they never passed to JS.
 
 Mnemonics and private keys are stored and accessed in the native iOS secure keychain key-value store via associated keys formed from concatenating a constant prefix with the associated public address.
 
 Uses KeychainSwift as a wrapper utility to interface with the native iOS secure keychain. */

import Foundation
import CryptoKit

// TODO: [MOB-3863] move constants to another file
let prefix = "com.uniswap.mobile"
let mnemonicPrefix = ".mnemonic."
let privateKeyPrefix = ".privateKey."
let entireMnemonicPrefix = prefix + mnemonicPrefix
let entirePrivateKeyPrefix = prefix + privateKeyPrefix

enum RNEthersRSError: String, Error  {
  case storeMnemonicError = "storeMnemonicError"
  case retrieveMnemonicError = "retrieveMnemonicError"
}

@objc(RNEthersRS)

class RNEthersRS: NSObject {
  private let keychain = KeychainSwift(keyPrefix: prefix)
  // TODO: [MOB-3871] LRU cache to ensure we don't create too many (unlikely to happen)
  private var walletCache: [String: OpaquePointer] = [:]
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  /**
   Fetches all mnemonic IDs, which are used as keys to access the actual mnemonics in the native keychain secure key-value store.
   
   - returns: array of mnemonic IDs
   */
  @objc(getMnemonicIds:reject:)
  func getMnemonicIds(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    let mnemonicIds = keychain.allKeys.filter { key in
      key.contains(mnemonicPrefix)
    }.map { key in
      key.replacingOccurrences(of: entireMnemonicPrefix, with: "")
    }
    resolve(mnemonicIds)
  }
  
  /**
   Derives private key from mnemonic with derivation index 0 and retrieves associated public address. Stores imported mnemonic in native keychain with the mnemonic ID key as the public address.
   
   - parameter mnemonic: The mnemonic phrase to import
   - returns: public address from the mnemonic's first derived private key
   */
  @objc(importMnemonic:resolve:reject:)
  func importMnemonic(
    mnemonic: String, resolve: RCTPromiseResolveBlock,
    reject: RCTPromiseR