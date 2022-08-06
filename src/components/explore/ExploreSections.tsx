
import { NetworkStatus } from '@apollo/client'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ListRenderItem, ListRenderItemInfo } from 'react-native'
import { useAppSelector } from 'src/app/hooks'
import { FavoriteTokensGrid } from 'src/components/explore/FavoriteTokensGrid'
import { FavoriteWalletsGrid } from 'src/components/explore/FavoriteWalletsGrid'
import { SortButton } from 'src/components/explore/SortButton'
import { TokenItem, TokenItemData } from 'src/components/explore/TokenItem'
import { Box, Flex, Inset } from 'src/components/layout'
import { BaseCard } from 'src/components/layout/BaseCard'
import { Loader } from 'src/components/loading'
import { Text } from 'src/components/Text'
import { ChainId } from 'src/constants/chains'
import { EMPTY_ARRAY, PollingInterval } from 'src/constants/misc'
import { WRAPPED_NATIVE_CURRENCY } from 'src/constants/tokens'
import {
  Chain,
  ExploreTokensTabQuery,
  useExploreTokensTabQuery,
} from 'src/data/__generated__/types-and-hooks'
import { usePersistedError } from 'src/features/dataApi/utils'
import {
  getClientTokensOrderByCompareFn,
  getTokenMetadataDisplayType,
  getTokensOrderByValues,
} from 'src/features/explore/utils'
import { selectHasFavoriteTokens, selectHasWatchedWallets } from 'src/features/favorites/selectors'
import { selectTokensOrderBy } from 'src/features/wallet/selectors'
import { areAddressesEqual } from 'src/utils/addresses'
import { fromGraphQLChain } from 'src/utils/chainId'
import { buildCurrencyId, buildNativeCurrencyId } from 'src/utils/currencyId'
import { usePollOnFocusOnly } from 'src/utils/hooks'

type ExploreSectionsProps = {
  listRef?: React.MutableRefObject<null>
}

export function ExploreSections({ listRef }: ExploreSectionsProps): JSX.Element {
  const { t } = useTranslation()

  // Top tokens sorting
  const orderBy = useAppSelector(selectTokensOrderBy)
  const tokenMetadataDisplayType = getTokenMetadataDisplayType(orderBy)
  const { clientOrderBy, serverOrderBy } = getTokensOrderByValues(orderBy)

  const {
    data,
    networkStatus,
    loading: requestLoading,
    error: requestError,
    refetch,
    startPolling,
    stopPolling,
  } = useExploreTokensTabQuery({
    variables: {
      topTokensOrderBy: serverOrderBy,
    },
    returnPartialData: true,
  })

  usePollOnFocusOnly(startPolling, stopPolling, PollingInterval.Fast)

  const topTokenItems = useMemo(() => {
    if (!data || !data.topTokens) return EMPTY_ARRAY

    // special case to replace weth with eth because the backend does not return eth data
    // eth will be defined only if all the required data is available
    // when eth data is not fully available, we do not replace weth with eth
    const { eth } = data
    const weth = WRAPPED_NATIVE_CURRENCY[ChainId.Mainnet]

    const topTokens = data.topTokens
      .map((token) => {
        if (!token) return
