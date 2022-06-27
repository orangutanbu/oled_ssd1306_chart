import { Token } from '@uniswap/sdk-core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { MATIC_MAINNET_ADDRESS } from 'src/constants/addresses'
import { ChainId } from 'src/constants/chains'
import { DAI, USDC, USDT, WBTC, WRAPPED_NATIVE_CURRENCY } from 'src/constants/tokens'
import { useTokenProjects } from 'src/features/dataApi/tokenProjects'
import { CurrencyInfo, GqlResult } from 'src/features/dataApi/types'
import { usePersistedError } from 'src/features/dataApi/utils'
import { NativeCurrency } from 'src/features/tokens/NativeCurrency'
import { areAddressesEqual } from 'src/utils/addresses'
import { currencyId } from 'src/utils/currencyId'

// Use Mainnet base token addresses since TokenProjects query returns each token on Arbitrum, Optimism, Polygon
const baseCurrencies = [
  NativeCurrency.onChain(ChainId.Mainnet),
  NativeCurrency.onChain(ChainId.Polygon), // Used for MATIC base currency on Polygon
  DAI,
  USDC,
  USDT,
  WBTC,
  WRAPPED_NATIVE_CURRENCY[ChainId.Mainnet],
]

export const baseCurrencyIds = baseCurrencies.map(currencyId)

export function useAllCommonBaseCurrencies(): GqlResult<CurrencyInfo[]> {
  const { data: baseCurrencyInfos, loading, error, refetch } = useTokenProjects(baseCurrencyIds)
  const persistedError = usePersistedError(loading, error)

  // TokenProjects returns MATIC on Mainnet and Polyg