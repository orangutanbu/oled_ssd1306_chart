import { CurrencyAmount } from '@uniswap/sdk-core'
import { testSaga } from 'redux-saga-test-plan'
import { ChainId } from 'src/constants/chains'
import { NativeCurrency } from 'src/features/tokens/NativeCurrency'
import { sendTransaction } from 'src/features/transactions/sendTransaction'
import { Params, wrap } from 'src/features/transactions/swap/wrapSaga'
import { TransactionType, WrapTransactionInfo } from 'src/features/transactions/types'
import { account } from 'src/test/fixtures'

const wrapTxInfo: WrapTransactionInfo = {
  type: TransactionType.Wrap,
  unwrapped: false,
  currencyAmountRaw: '200000',
}

const unwrapTxInfo: WrapTransactionInfo = {
  ...wrapTxInfo,
  unwrapped: true,
}

const transaction = {
  from: account.address,
  to: '0xabc',
  data: '0x01',
  chainId: ChainId.Mainnet,
}

const params: Params = {
  txId: '1',
  account,
  txRequest: transaction,
  inputCurrencyAmount: CurrencyAmount.fromRawAmount(
    NativeCurrency.