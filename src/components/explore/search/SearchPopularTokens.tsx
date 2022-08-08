import React, { useMemo } from 'react'
import { FlatList, ListRenderItemInfo } from 'react-native'
import { SearchTokenItem } from 'src/components/explore/search/items/SearchTokenItem'
import { Inset } from 'src/components/layout'
import { Loader } from 'src/components/loading'
import { ChainId } from 'src/constants/chains'
import { EMPTY_ARRAY } from 'src/constants/misc'
import { WRAPPED_NATIVE_CURRENCY } from 'src/constants/tokens'
import {
  Chain,
  SearchPopularTokensQuery,
  useSearchPopularTokensQuery,
} from 'src/data/__generated__/types-and-hooks'
import { SearchResultType, TokenSearchResult } from 'src/features/explore/searchHistorySlice'
import { areAddressesEqual } from 'src/utils/addresses'
import { fromGraphQLChain } from 'src/utils/chainId'
import { buildCurrencyId, buildNativeCurrencyId } from 'src/utils/currencyId'

export function SearchPopularTokens(): JSX.Element {
  // Load popular tokens by top Uniswap trading volume
  const { data, loading } = useSearchPopularTokensQuery()

  const popularTokens = useMemo(() => {
    if (!data || !data.topTokens) return EMPTY_ARRAY

    // special case to replace weth with eth because the backend does not return eth data
    // eth will be defined only if all the required data is available
    // when eth data is not fully available, we do not replace weth with eth
    const eth = data?.