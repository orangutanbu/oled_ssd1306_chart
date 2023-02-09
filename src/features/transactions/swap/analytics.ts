import { SwapEventName } from '@uniswap/analytics-events'
import { Currency, TradeType } from '@uniswap/sdk-core'
import { BigNumber } from 'ethers'
import { useEffect, useRef } from 'react'
import { sendAnalyticsEvent } from 'src/features/telemetry'
import { SwapTradeBaseProperties } from 'src/features/telemetry/types'
import { DerivedSwapInfo } from 'src/features/transactions/swap/hooks'
import { Trade } from 'src/features/transactions/swap/useTrade'
import { currencyAddress, getCurrencyAddressForAnalytics } from 'src/utils/currencyId'
import { formatCurrencyAmount, NumberType } from 'src/utils/format'

// hook-based analytics because this one is data-lifecycle dependent
export function useSwapAnalytics(derivedSwapInfo: DerivedSwapInfo): void {
  const {
    trade: { trade },
  } = derivedSwapInfo

  const tradeRef = useRef(trade)

  useEffect(() => {
    tradeRef.current = trade
  }, [trade])

  const inputAmount = tradeRef.current?.inputAmount.toExact()
  const inputCurrency = tradeRef.current?.inputAmount.currency
  const outputCurrency = tradeRef.current?.outputAmount.currency
  const tradeType = tradeRef.current?.tradeType

  // run useEffect based on ids since `Currency` objects themselves may be
  // different instances per render
  const inputCurrencyId = inputCurrency && currencyAddress(inputCurrency)
  const outputCurr