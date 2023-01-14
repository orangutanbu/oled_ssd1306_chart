import { Currency } from '@uniswap/sdk-core'
import React, { useMemo } from 'react'
import { Text } from 'src/components/Text'
import { useSpotPrice } from 'src/features/dataApi/spotPricesQuery'
import { createBalanceUpdate } from 'src/features/notifications/utils'
import { TransactionStatus, TransactionType } from 'src/features/transactions/types'
import { currencyId } from 'src/utils/currencyId'

interface BalanceUpdateProps {
  currency: NullUndefined<Currency>
  amountRaw: string | undefined
  transactionType: TransactionType
  transactionStatus: TransactionStatus
}

export default function BalanceUpdate({
  currency,
  amountRaw,
  transactionType,
  transactionStatus,
}: BalanceUpdateProps): JSX.Element | null {
  const _currencyId = currency ? currencyId(currency) : null
  const { data: spotPrice, loa