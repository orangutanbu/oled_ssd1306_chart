import { TradeType } from '@uniswap/sdk-core'
import { expectSaga } from 'redux-saga-test-plan'
import { NATIVE_ADDRESS } from 'src/constants/addresses'
import { AssetType } from 'src/entities/assets'
import { pushNotification } from 'src/features/notifications/notificationSlice'
import { pushTransactionNotification } from 'src/features/notifications/notificationWatcher'
import { AppNotificationType } from 'src/features/notifications/types'
import { finalizeTransaction } from 'src/features/transactions/slice'
import {
  ApproveTransactionInfo,
  ExactOutputSwapTransactionInfo,
  ReceiveTokenTransactionInfo,
  SendTokenTransactionInfo,
  TransactionStatus,
  TransactionType,
  TransactionTypeInfo,
  UnknownTransactionInfo,
} from 'src/features/transactions/types'
import { finalizedTxAction } from 'src/test/fixtures'

const txId = 'uuid-4'

export const createFinalizedTxAction = (
  typeInfo: TransactionTypeInfo
): ReturnType<typeof finalizeTransaction> => ({
  payload: {
    ...finalizedTxAction.payload,
    typeInfo,
    id: txId,
  },
  type: '',
})

describe(pushTransactionNotification, () => {
  it('Handles approve transactions', () => {
    const approveTypeInfo: ApproveTransactionInfo = {
      type: TransactionType.Approve,
      tokenAddress: '0xUniswapToken',
      spender: '0xUniswapDeployer',
    }
    const finalizedApproveAction = createFinalizedTxAction(approveTypeInfo)
    const { chainId, from, hash } = finalizedApproveAction.payload

    return expectSaga(pushTransactionNotification, finalizedApproveAction)
      .withState({
        transactions: {
          [from]: {
            [chainId]: {
              uuid1: { typeInfo: TransactionType.Approve, addedTime: Date.now() },
              uuid2: { typeInfo: TransactionType.Swap, addedTime: Date.now() + 3000 },
            },
          },
        },
      })
      .put(
        pushNotification({
          txStatus: TransactionStatus.Success,
          address