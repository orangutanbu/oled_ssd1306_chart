// If the message to be signed is a hex string, it must be converted to an array:

import { providers, TypedDataDomain, TypedDataField, Wallet } from 'ethers'
import { arrayify, isHexString } from 'ethers/lib/utils'
import { Account } from 'src/features/wallet/accounts/types'
import { NativeSigner } from 'src/features/wallet/signing/NativeSigner'
import { SignerManager } from 'src/features/wallet/signing/SignerManager'
import { ensureLeading0x } from 'src/utils/addresses'
import { logger } from 'src/utils/logger'

type EthTypedMessage = {
  domain: TypedDataDomain
  types: Record<string, Array<TypedDataField>>
  message: Record<string, unknown>
}

// https://docs.ethers.io/v5/api/signer/#Signer--signing-methods
export async function signMessage(
  message: string,
  account: Account,
  signerManager: 