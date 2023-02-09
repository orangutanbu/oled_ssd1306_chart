import { Currency, TradeType } from '@uniswap/sdk-core'
import { BigNumber, BigNumberish } from 'ethers'
import { TFunction } from 'i18next'
import { ChainId } from 'src/constants/chains'
import { WRAPPED_NATIVE_CURRENCY } from 'src/constants/tokens'
import { AssetType } from 'src/entities/assets'
import { DEFAULT_SLIPPAGE_TOLERANCE_PERCENT } from 'src/features/transactions/swap/hooks'
import { Trade } from 'src/features/transactions/swap/useTrade'
import { WrapType } from 'src/features/transactions/swap/wrapSaga'
import {
  ExactInputSwapTransactionInfo,
  ExactOutputSwapTransactionInfo,
  TransactionType,
} from 'src/features/transactions/types'
import { areAddressesEqual } from 'src/utils/addresses'
import {
  CurrencyId,
  currencyId,
  currencyIdToAddress,
  currencyIdToChain,
} from 'src/utils/currencyId'
import { formatPrice, NumberType } from 'src/utils/format'
import { CurrencyField, TransactionState } from '../transactionState/transactionState'

export function serializeQueryParams(
  params: Record<string, Parameters<typeof encodeURIComponent>[0]>
): string {
  const queryString = []
  for (const [param, value] of Object.entries(params)) {
    queryString.push(`${encodeURIComponent(param)}=${encodeURIComponent(value)}`)
  }
  return queryString.join('&')
}

export function getWrapType(
  inputCurrency: Currency | null | undefined,
  outputCurrency: Currency | null | undefined
): WrapType {
  if (!inputCurrency || !outputCurrency || inputCurrency.chainId !== outputCurrency.chainId) {
    return WrapType.NotApplicable
  }

  const weth = WRAPPED_NATIVE_CURRENCY[inputCurrency.chainId as ChainId]

  if (inputCurrency.isNative && outputCurrency.equals(weth)) {
    return WrapType.Wrap
  } else if (outputCurrency.isNative && inputCurrency.equals(weth)) {
    return WrapType.Unwrap
  }

  return WrapType.NotApplicable
}

export function isWrapAction(wrapType: WrapType): wrapType is WrapType.Unwrap | WrapType.Wrap {
  return wrapType === WrapType.Unwrap || wrapType === WrapType.Wrap
}

export function tradeToTransactionInfo(
  trade: Trade
): ExactInputSwapTransactionInfo | ExactOutputSwapTransactionInfo {
  return trade.tradeType === TradeType.EXACT_INPUT
    ? {
        type: TransactionType.Swap,
        inputCurrencyId: currencyId(trade.inputAmount.currency),
        outputCurrencyId: currencyId(trade.outputAmount.currency),
        tradeType: TradeType.EXACT_INPUT,
        inputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
        expectedOutputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
        minimumOutputCurrencyAmountRaw: trade
          .minimumAmountOut(DEFAULT_SLIPPAGE_TOLERANCE_PERCENT)
          .quotient.toString(),
      }
    : {
        type: TransactionType.Swap,
        inputCurrencyId: currencyId(trade.inputAmount.currency),
        outputCurrencyId: currencyId(trade.outputAmount.currency),
        tradeType: TradeType.EXACT_OUTPUT,
        outputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
        expectedInputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
        maximumInputCurrencyAmountRaw: trade
          .maximumAmountIn(DEFAULT_SLIPPAGE_TOLERANCE_PERCENT)
          .quotient.toString(),
      }
}

export function requireAcceptNewTrade(
  oldTrade: NullUndefined<Trade>,
  newTrade: NullUndefined<Trade>
): boolean {
  return oldTrade?.quote?.methodParameters?.calldata !== newTrade?.quote?.methodParameters?.calldata
}

export const getRateToDisplay = (trade: Trade, showInverseRate: boolean): string => {
  const price = showInverseRate ? trade.executionPrice.invert() : trade.executionPrice
  const formattedPrice = formatPrice(price, NumberType.SwapPrice)
  const { quoteCurrency, baseCurrency } = trade.executionPrice
  const rate = `1 ${quoteCurrency.symbol} = ${formattedPrice} ${baseCurrency.symbol}`
  const inverseRate = `1 ${baseCurrency.symbol} = ${formattedPrice} ${quoteCurrency.symbol}`
  return showInverseRate ? rate : inverseRate
}

export const formatAsHexString = (input?: BigNumberish): string | undefined =>
  input !== undefined ? BigNumber.from(input).toHexString() : input

export const getActionName = (t: TFunction, wrapType