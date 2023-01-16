import { CallEffect, ForkEffect, PutEffect, SelectEffect } from 'redux-saga/effects'
import { appSelect } from 'src/app/hooks'
import { ChainId } from 'src/constants/chains'
import { AssetType } from 'src/entities/assets'
import { pushNotification } from 'src/features/notifications/notificationSlice'
import { AppNotification, AppNotificationType } from 'src/features/notifications/types'
import { buildReceiveNotification } from 'src/features/notifications/utils'
import { selectTransactions } from 'src/features/transactions/selectors'
import { finalizeTransaction } from 'src/features/transactions/slice'
import { TransactionType } from 'src/features/transactions/types'
import { getInputAmountFromTrade, getOutputAmountFromTrade } from 'src/features/transactions/utils'
import { WalletConnectEvent } from 'src/features/walletConnect/saga'
import { call, put, takeLatest } from 'typed-redux-saga'

export function* notificationWatcher(): Generator<ForkEffect<never>, void, unknown> {
  yield* takeLatest(finalizeTransaction.type, pushTransactionNotification)
}

export function* pushTransactionNotification(
  action: ReturnType<typeof finalizeTransaction>
): Generator<
  | PutEffect<{
      payload: AppNotification
      type: string
    }>
  | CallEffect<boolean>,
  void,
  unknown
> {
  const { chainId, status, typeInfo, hash, id, from, addedTime } = action.payload

  const baseNotificationData = {
    txStatus: status,
    chainId,
    txHash: hash,
    address: from,
    txId: id,
  }

  if (typeInfo.type === TransactionType.Approve) {
    const shouldSuppressNotification = yield* call(
   