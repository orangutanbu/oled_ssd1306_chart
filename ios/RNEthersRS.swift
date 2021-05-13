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
    reject: RCTPromiseRejectBlock
  ) {
    let private_key = private_key_from_mnemonic(
      mnemonic, UInt32(exactly: 0)!)
    let address = String(cString: private_key.address!)
    
    let res = storeNewMnemonic(mnemonic: mnemonic, address: address)
    if res != nil {
      resolve(res)
      return
    }
    let err = NSError.init()
    reject("error", "error", err)
    return
  }
  
  /**
   Generates a new mnemonic and retrieves associated public address. Stores new mnemonic in native keychain with the mnemonic ID key as the public address.
   
   - returns: public address from the mnemonic's first derived private key
   */
  @objc(generateAndStoreMnemonic:reject:)
  func generateAndStoreMnemonic(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    let mnemonic_ptr = generate_mnemonic()
    let mnemonic_str = String(cString: mnemonic_ptr.mnemonic!)
    let address_str = String(cString: mnemonic_ptr.address!)
    let res = storeNewMnemonic(mnemonic: mnemonic_str, address: address_str)
    mnemonic_free(mnemonic_ptr)
    resolve(res)
  }
  
  /**
   Stores mnemonic phrase in Native Keychain under the address
   
   - returns: public address if successfully stored in native keychain
   */
  func storeNewMnemonic(mnemonic: String, address: String) -> String? {
    let newMnemonicKey = keychainKeyForMnemonicId(mnemonicId: address);
    let checkStored = retrieveMnemonic(mnemonicId: newMnemonicKey)
    
    if checkStored == nil {
      keychain.set(mnemonic, forKey: newMnemonicKey, withAccess: .accessibleWhenUnlockedThisDeviceOnly)
      return address
    }
    
    return nil
  }
  
  func keychainKeyForMnemonicId(mnemonicId: String) -> String {
    return mnemonicPrefix + mnemonicId
  }
  
  func retrieveMnemonic(mnemonicId: String) -> String? {
    return keychain.get(keychainKeyForMnemonicId(mnemonicId: mnemonicId))
  }
  
  /**
   Fetches all public addresses from private keys stored under `privateKeyPrefix` in native keychain. Used from React Native to verify the native keychain has the private key for an account that is attempting create a NativeSigner that calls native signing methods
   
   - returns: public addresses for all stored private keys
   */
  @objc(getAddressesForStoredPrivateKeys:reject:)
  func getAddressesForStoredPrivateKeys(
    resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock
  ) {
    let addresses = keychain.allKeys.filter { key in
      key.contains(privateKeyPrefix)
    }.map { key in
      key.replacingOccurrences(of: entirePrivateKeyPrefix, with: "")
    }
    resolve(addresses)
  }
  
  func storeNewPrivateKey(address: String, privateKey: String) {
    let newKey = keychainKeyForPrivateKey(address: address);
    keychain.set(privateKey, forKey: newKey, withAccess: .accessibleWhenUnlockedThisDeviceOnly)
  }
  
  /**
   Derives private key and public address from mnemonic associated with `mnemonicId` for given `derivationIndex`. Stores the private key in native keychain with key.
   