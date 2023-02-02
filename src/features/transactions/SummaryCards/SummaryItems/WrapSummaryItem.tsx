import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { SwapLogoOrLogoWithTxStatus } from 'src/components/CurrencyLogo/LogoWithTxStatus'
import {
  useNativeCurrencyInfo,
  useWrappedNativeCurrencyInfo,
} from 'src/features/tokens/useCurrencyInfo'
import BalanceUpdate from 'src/features/transactions/SummaryCards/BalanceUpdate'
import TransactionSummaryLayout, {
  TXN_HISTORY_ICON_SIZE,
} from 'src/features/transactions/SummaryCards/TransactionSummaryLayout'
import { BaseTransactionSummaryProps } from 'src/features/transactions/SummaryCards/TransactionSummaryRouter'
import { getTransactionTitle } from 'src/features/transactions/SummaryCards/utils'
import { TransactionStatus, WrapTransactionInfo } from 'src/features/transactions/types'

export default function WrapSummaryItem