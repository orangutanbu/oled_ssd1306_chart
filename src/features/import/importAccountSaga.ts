import dayjs from 'dayjs'
import { AllEffect, CallEffect, PutEffect } from 'redux-saga/effects'
import { ImportAccountParams, ImportAccountType } from 'src/features/import/types'
import { Account, AccountType, BackupType } from 'src/features/wallet/accounts/types'
import {
  activateAccount,
  addAccount,
  addAccounts,
  unlockWallet,
} from 'src/features/wallet/walletSlice'
import { generateAndStorePrivateKey, importMnemonic } from 'src/lib/RNEthersRs'
import { getChecksumAddress } from 'src/utils/addresses'
import { logger } from 'src/utils/logger'
import { createMonitoredSaga } from 'src/utils/saga'
import { all, call, put, SagaGenerator } from 'typed-redux-saga'

export const IMPORT_WALLET_AMOUNT = 10

export function* importAccount(params: ImportAccountParams): Generator<
  | CallEffect<void>
  | CallEffect<
      Generator<
        | CallEffect<void>
        | CallEffect<string>
        | AllEffect<SagaGenerator<string, CallEffect<string>>>
        | PutEffect<{
            payload: Account[]
            type: string
          }>,
        void,
        unknown
      >
    >,
  void,
  unknown
> {
  const { type, name } = params
  logger.debug('importAccountSaga', 'importAccount', 'Importing type:', type)

  if (type === ImportAccountType.Address) {
    yield* call(importAddressAccount, params.address, name, params.ignoreActivate)
  } else if (type === ImportAccountType.Mnemonic) {
    yield* call(
      importMnemonicAccounts,
      params.validatedMnemonic,
      name,
      params.indexes,
      params.markAsActive,
      params.ignoreActivate
    )
  } else if (type === ImportAccountType.RestoreBackup) {
    yield* call(importRestoreBackupAccounts, params.mnemonicId, params.indexes)
  } else {
    throw new Error('Unsupported import account type')
  }
}

function* importAddressAccount(
  address: string,
  name?: string,
  ignoreActivate?: boolean
): Generator<CallEffect<void>, void, unknown> {
  const formattedAddress = getChecksumAddress(address)
  const account: Account = {
    type: AccountType.Readonly,
    address: formattedAddress,
    name,
    pending: true,
    timeImportedMs: dayjs().valueOf(),
