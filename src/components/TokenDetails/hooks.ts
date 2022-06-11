import { useMemo } from 'react'
import { useAppStackNavigation } from 'src/app/navigation/types'
import { Chain, useTokenDetailsScreenLazyQuery } from 'src/data/__generated__/types-and-hooks'
import { useMultipleBalances, useSingleBalance } from 'src/features/dataApi/balances'
import { PortfolioBalance } from 'src/features/dataApi/types'
import { currencyIdToContractInput } from 'src/features/dataApi/utils'
import { Screens } from 'src/screens/Screens'
import { fromGraphQLChain } from 'src/utils/chainId'
import {
  buildCurrencyId,
  buildNativeCurrencyId,
  CurrencyId,
  currencyIdToChain,
} from 'src/utils/currencyId'

/** Helper hook to retrieve balances across chains for a given currency, for the active account. */
export function useCrossChainBalances(
  currencyId: string,
  bridgeInfo: NullUndefined<{ chain: Chain; address?: NullUndefined<string> }[]>
): {
  currentChainBalance: PortfolioBalance | null
  otherChainBalances: PortfolioBalance[] | null
} {
  const currentChainBalance = useSingleBalance(currencyId)
  const currentChainId = currencyIdToChain(currencyId)

  const bridgedCurrencyIds = useMemo(
    () =>
      bridgeInfo
        ?.map(({ chain, address }) => {
          const chainId = fromGraphQLChain(chain)
          if (!chainId || chainId === currentChainId) return null
          if (!address) return buildNativeCurrencyId(chainId)
          return buildCurrencyId(chainId, address)
        })
        .filter((b): b is string => !!b),

    [bridgeInfo, currentChainId]
  )
  const otherChainBalances = useMultipleBalances(bridgedCurrencyIds)

  return {
    currentChainBalance,
    otherChainBalances,
  }
}

/** Utility hook to simplify navigating to token details screen */
export function useTokenDetailsNavigation(): {
  preload: (currencyId: CurrencyId) => void
  navigate: (currencyId: CurrencyId, currencyName?: string) => void
  navigateWithPop: (currencyId: CurrencyId, currencyName?: string) => void
} {
  const navigation = useAppStackNavigation()
  const [load] = useTokenDetailsScreenLazyQuery()

  const preload = (currencyId: CurrencyId): void => {
    load({
      variables: currencyIdToContractInput(currencyId)