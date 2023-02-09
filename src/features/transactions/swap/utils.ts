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
