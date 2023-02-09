import { TradeType } from '@uniswap/sdk-core'
import { TFunction } from 'i18next'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ChainId } from 'src/constants/chains'
import { getFormattedCurrencyAmount } from 'src/features/notifications/utils'
import { useSelectTransaction } from 'src/features/transactions/hooks'
import { DerivedSwapInfo } from 'src/features/transactions/swap/hooks'
import { WrapType } from 'src/features/transactions/swap/wrapSaga'
import { TransactionPending } from 'src/features/transactions/TransactionPending/TransactionPending'
import { CurrencyField } from 'src/features/transactions/transactionState/transactionState'
import {
  TransactionDetails,
  TransactionStatus,
  TransactionType,
} from 'src/features/transactions/types'
import { getInputAmountFromTrade, getOutputAmountFromTrade } from 'src/features/transactions/utils'
import { useActiveAccountAddressWithThrow } from 'src/features/wallet/hooks'
import { toSupportedChainId } from 'src/utils/chainId'

type SwapStatusProps = {
  derivedSwapInfo: DerivedSwapInfo
  onNext: () => void
  onTryAgain: () => void
}

type SwapStatusText = {
  title: string
  description: string
}

const getTextFromTxStatus = (
  t: TFunction,
  derivedSwapInfo: DerivedSwapInfo,
  transactionDetails?: TransactionDetails
): SwapStatusText => {
  if (derivedSwapInfo.wrapType === WrapType.NotApplicable) {
    return getTextFromSwapStatus(t, derivedSwapInfo, transactionDetails)
  }

  return getTextFromWrapStatus(t, derivedSwapInfo, transactionDetails)
}

const getTextFromWrapStatus = (
  t: TFunction,
  derivedSwapInfo: DerivedSwapInfo,
  transactionDetails?: TransactionDetails
): SwapStatusText => {
  const { wrapType } = derivedSwapInfo

  // transactionDetails may not been added to the store yet
  if (!transactionDetails || transactionDetails.status === TransactionStatus.Pending) {
    if (wrapType === WrapType.Unwrap) {
      return {
        title: t('Unwrap pending'),
        description: t('We’ll notify you once your unwrap is complete.'),
      }
    }

    return {
      title: t('Wrap pending'),
      description: t('We’ll notify you once your wrap is complete.'),
    }
  }

  if (transactionDetails.typeInfo.type !== TransactionType.Wrap) {
    throw new Error('input to getTextFromWrapStatus must be a wrap transaction type')
  }

  const status = transactionDetails.status
  if (status === TransactionStatus.Success) {
    