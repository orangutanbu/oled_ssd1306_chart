import React, { memo, useEffect, useState } from 'react'
import { InteractionManager } from 'react-native'
import { Delay, Delayed } from 'src/components/layout/Delayed'
import {
  useTokenDetailsScreenLazyQuery,
  useTokenPriceHistoryLazyQuery,
} from 'src/data/__generated__/types-and-hooks'
import { useSortedPortfolioBalances } from 'src/features/dataApi/balances'
import { PortfolioBalance } from 'src/features/dataApi/types'
import { currencyIdToContractInput } from 'src/features/dataApi/utils'
import { useActiveAccount } from 'src/features/wallet/hooks'
import { CurrencyId } from 'src/utils/currencyId'

/**
 * Helper component to preload token details for the top `count` token by balance
 * Requires JSX as Apollo's `useQuery` can only track one set of variable
 * NOTE: an alternative would be to pass multiple contracts to the query, but
 * Apollo would require a cache redirect to return partial data.
 */
export const TokenDetailsPreloaders = memo(({ count = 10 }: { count?: number }) => {
  const account = useActiveAccount()

  const [stableData, setStableData] = useState<PortfolioBalance[] | undefined>()
  const { data } = useSortedPortfolioBalances(
    account?.address 