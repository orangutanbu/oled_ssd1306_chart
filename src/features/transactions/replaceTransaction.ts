import { BigNumber, providers } from 'ethers'
import { CallEffect, PutEffect, SelectEffect } from 'redux-saga/effects'
import { appSelect } from 'src/app/hooks'
import { i18n } from 'src/app/i18n'
import { getProvider, getSignerManager } from 'src/app/walletContext'
import { pushNotification } from 'src/features/notifications/notificationSlice'
import { AppNotification, AppNotificationType } from 'src/features/notifications/types'
import { signAndSendTransaction } from 'src/features/transactions/sendTransaction'
import { finalizeTransaction, updateTransaction } from 'src/features/transactions/slice'
import { TransactionDetails, TransactionStatus } from 'src/features/transactions/types'
import { getSerializableTransactionRequest } from 'src/features/transactions/utils'
import { selectAccounts } from 'src/features/wallet/selectors'
import { SignerManager } from 'src/features/wallet/signing/SignerManager'
import { getChecksumAddress } from 'src/utils/addresses'
import { logger } from 'src/utils/logger'
import { call, put } from 'typed-redux-saga'

export function* attemptReplaceTransaction(
  transaction: TransactionDetails,
  newTxRequest: providers.TransactionRequest,
  isCancellation = false
): Generator<
  | SelectEffect
  | CallEffect<providers.JsonRpcProvider>
  | CallEffect<SignerManager>
  | Cal