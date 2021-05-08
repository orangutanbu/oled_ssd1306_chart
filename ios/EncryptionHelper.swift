//
//  EncryptionHelper.swift
//  Uniswap
//
//  Created by Spencer Yen on 7/26/22.
//

import CryptoKit
import Argon2Swift

/**
 Encrypts given secret using AES-GCM cipher secured by symmetric key derived from given password.
 
 - parameter secret: plaintext secret to encrypt
 - parameter password: password to generate encryption key
 - parameter salt: randomized data string used with password to generate encryption key
 - returns: encrypted secret string
 */
func encrypt(secret: String, password: String, salt: String) throws -> String {
  let key = try keyFromPassword(password: password, salt: salt)
  let secretData = secret.data(using: .utf8)!

  // Encrypt data into SealedBox, return as string
  let sealedBox = try AES.GCM.seal(secretData, using: key)
  let encryptedData = sealedBox.combined
  let encryptedSecret = encryptedData!.base64EncodedString()

  return encryptedSecret
}

/**
 Attempts to decrypt AES-GCM encrypted secret using symmetric key derived from given user pin.
 
 - parameter encryptedSecret: secret in cipher encrypted form
 - parameter password: pa