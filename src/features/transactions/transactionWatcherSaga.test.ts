import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga/effects'
import { getProvider, getProviderManager } from 'src/app/walletContext'
import { ChainId } from 'src/constants/chains'
import { PollingInterval } from 'src/constants/misc'
import { fetchFiatOnRampTransaction } from 'src/features/fiatOnRamp/api'
import { waitForProvidersInitialized } from 'src/features/providers/providerSaga'
import { attemptCancelTransaction } from 'src/features/transactions/cancelTransaction'
import {
  addTransaction,
  cancelTransaction,
  finalizeTransaction,
  transactionActions,
  updateTransaction,
} from 'src/features/transactions/slice'
import {
  getFlashbotsTxConfirmation,
  transactionWatcher,
  waitForReceipt,
  watchFiatOnRampTransaction,
  watchFlashbotsTransaction,
  watchTransaction,
} from 'src/features/transactions/transactionWatcherSaga'
import { TransactionDetails, TransactionStatus } from 'src/features/transactions/types'
import {
  fiatOnRampTxDetailsPending,
  finalizedTxAction,
  mockProvider,
  mockProviderManager,
  provider,
  txDetailsPending,
  txReceipt,
  txRequest,
} from 'src/test/fixtures'
import { sleep } from 'src/utils/timing'

describe(transactionWatcher, () => {
  it('Triggers watchers successfully', () => {
    return expectSaga(transactionWatcher)
      .withState({
        transactions: {
          byChainId: {
            [ChainId.Mainnet]: {
              '0': txDetailsPending,
            },
          },
        },
      })
      .provide([
        [call(waitForProvidersInitialized), true],
        [call(getProvider, ChainId.Mainnet), mockProvider],
        [call(getProviderManager), mockProviderManager],
      ])
      .fork(watchTransaction, txDetailsPending)
      .dispatch(addTransaction(txDetailsPending))
      .fork(watchTransaction, txDetailsPending)
      .dispatch(updateTransaction(txDetailsPending))
      .fork(watchTransaction, txDetailsPending)
      .silentRun()
  })
})

describe(watchFlashbotsTransaction, () => {
  let dateNowSpy: jest.SpyInstance
  beforeAll(() => {
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1400000000000)
  })
  afterAll(() => {
    dateNowSpy?.mockRestore()
  })

  const { chainId, hash } = txDetailsPending

  it('Finalizes successful transactions', () => {
    return expectSaga(watchFlashbotsTransaction, txDetailsPending)
      .withState({ wallet: { flashbotsEnabled: true } })
      .provide([
        [call(getProvider, chainId), provider],
        [call(waitForReceipt, hash, provider), txReceipt],
        [call(getFlashbotsTxConfirmation, hash, chainId), TransactionStatus.Success],
      ])
      .put(finalizeTransaction(finalizedTxAction.payload))
      .silentRun()
  })

  it('Handles failed transactions', () => {
    return expectSaga(watchFlashbotsTransaction, txDetailsPending)
      .withState({ wallet: { flashbotsEnabled: true } })
      .provide([
        [call(getProvider, chainId, true), provider],
        [call(waitForReceipt, hash, provider), txReceipt],
        [call(getFlashb