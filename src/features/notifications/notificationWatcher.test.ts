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
          address: from,
          chainId,
          txHash: hash,
          type: AppNotificationType.Transaction,
          txType: TransactionType.Approve,
          tokenAddress: approveTypeInfo.tokenAddress,
          spender: approveTypeInfo.spender,
          txId,
        })
      )
      .silentRun()
  })

  it('Suppresses approve notification if a swap was also submited within 3 seconds', () => {
    const approveTypeInfo: ApproveTransactionInfo = {
      type: TransactionType.Approve,
      tokenAddress: '0xUniswapToken',
      spender: '0xUniswapDeployer',
    }
    const finalizedApproveAction = createFinalizedTxAction(approveTypeInfo)
    const { chainId, from } = finalizedApproveAction.payload

    return expectSaga(pushTransactionNotification, finalizedApproveAction)
      .withState({
        transactions: {
          [from]: {
            [chainId]: {
              uuid1: { typeInfo: TransactionType.Approve, addedTime: Date.now() },
              uuid2: { typeInfo: TransactionType.Swap, addedTime: Date.now() + 2000 },
            },
          },
        },
      })
      .silentRun()
  })

  it('Handles swap transactions', () => {
    const swapTypeInfo: ExactOutputSwapTransactionInfo = {
      type: TransactionType.Swap,
      tradeType: TradeType.EXACT_OUTPUT,
      inputCurrencyId: `1-${NATIVE_ADDRESS}`,
      outputCurrencyId: '1-0x4d224452801ACEd8B2F0aebE155379bb5D594381',
      outputCurrencyAmountRaw: '230000000000000000',
      expectedInputCurrencyAmountRaw: '12000000000000000',
      maximumInputCurrencyAmountRaw: '12000000000000000',
    }
    const finalizedSwapAction = createFinalizedTxAction(swapTypeInfo)
    const { chainId, from, hash } = finalizedSwapAction.payload

    return expectSaga(pushTransactionNotification, finalizedSwapAction)
      .put(
        pushNotification({
          txStatus: TransactionStatus.Success,
          address: from,
          chainId,
          txHash: hash,
          type: AppNotificationType.Transaction,
          txType: TransactionType.Swap,
          inputCurrencyId: swapTypeInfo.inputCurrencyId,
          outputCurrencyId: swapTypeInfo.outputCurrencyId,
          inputCurrencyAmountRaw: swapTypeInfo.expectedInputCurrencyAmountRaw,
          outputCurrencyAmountRaw: swapTypeInfo.outputCurrencyAmountRaw,
          tradeType: swapTypeInfo.tradeType,
          txId,
        })
      )
      .silentRun()
  })

  it('Handles sending currency', () => {
    const sendCurrencyTypeInfo: SendTokenTransactionInfo = {
      type: TransactionType.Send,
      assetType: AssetType.Currency,
      currencyAmountRaw: '1000',
      recipient: '0x123abc456def',
      tokenAddress: '0xUniswapToken',
    }
    const finalizedSendCurrencyAction = createFinalizedTxAction(sendCurrencyTypeInfo)
    const { chainId, from, hash } = finalizedSendCurrencyAction.payload

    return expectSaga(pushTransactionNotification, finalizedSendCurrencyAction)
      .put(
        pushNotification({
          txStatus: TransactionStatus.Success,
        