import { ReactNavigationPerformanceView } from '@shopify/react-native-performance-navigation'
import { useResponsiveProp } from '@shopify/restyle'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FadeInDown, FadeOutDown } from 'react-native-reanimated'
import { useAppDispatch, useAppSelector, useAppTheme } from 'src/app/hooks'
import { AppStackScreenProp } from 'src/app/navigation/types'
import { TokenLogo } from 'src/components/CurrencyLogo/TokenLogo'
import { AnimatedBox, AnimatedFlex, Box, Flex } from 'src/components/layout'
import { BaseCard } from 'src/components/layout/BaseCard'
import { HeaderScrollScreen } from 'src/components/layout/screens/HeaderScrollScreen'
import { PriceExplorer } from 'src/components/PriceExplorer/PriceExplorer'
import { useTokenPriceHistory } from 'src/components/PriceExplorer/usePriceHistory'
import { Trace } from 'src/components/telemetry/Trace'
import { Text } from 'src/components/Text'
import { useCrossChainBalances } from 'src/components/TokenDetails/hooks'
import { TokenBalances } from 'src/components/TokenDetails/TokenBalances'
import { TokenDetailsActionButtons } from 'src/components/TokenDetails/TokenDetailsActionButton'
import { TokenDetailsFavoriteButton } from 'src/components/TokenDetails/TokenDetailsFavoriteButton'
import { TokenDetailsHeader } from 'src/components/TokenDetails/TokenDetailsHeader'
import { TokenDetailsStats } from 'src/components/TokenDetails/TokenDetailsStats'
import TokenWarningModal from 'src/components/tokens/TokenWarningModal'
import { ChainId } from 'src/constants/chains'
import { PollingInterval } from 'src/constants/misc'
import { isError, isNonPollingRequestInFlight } from 'src/data/utils'
import {
  SafetyLevel,
  TokenDetailsScreenQuery,
  useTokenDetailsScreenQuery,
} from 'src/data/__generated__/types-and-hooks'
import { AssetType } from 'src/entities/assets'
import { currencyIdToContractInput } from 'src/features/dataApi/utils'
import { openModal, selectModalState } from 'src/features/modals/modalSlice'
import { ModalName } from 'src/features/telemetry/constants'
import { useTokenWarningDismissed } from 'src/features/tokens/safetyHooks'
import {
  CurrencyField,
  TransactionState,
} from 'src/features/transactions/transactionState/transactionState'
import { Screens } from 'src/screens/Screens'
import { iconSizes } from 'src/styles/sizing'
import { fromGraphQLChain } from 'src/utils/chainId'
import { useExtractedTokenColor } from 'src/utils/colors'
import { currencyIdToAddress, currencyIdToChain } from 'src/utils/currencyId'
import { formatUSDPrice } from 'src/utils/format'

type Price = NonNullable<
  NonNullable<NonNullable<NonNullable<TokenDetailsScreenQuery['token']>['project']>['markets']>[0]
>['price']

function HeaderPriceLabel({ price }: { price: Price }): JSX.Element {
  const { t } = useTranslation()

  return (
    <Text color="textPrimary" variant="bodyLarge">
      {formatUSDPrice(price?.value) ?? t('Unknown token')}
    </Text>
  )
}

function HeaderTitleElement({ data }: { data: TokenDetailsScreenQuery | undefined }): JSX.Element {
  const { t } = useTranslation()

  const token = data?.token
  const tokenProject = token?.project

  return (
    <Flex alignItems="center" gap="none" justifyContent="space-between">
      <HeaderPriceLabel price={tokenProject?.markets?.[0]?.price} />
      <Flex centered row gap="spacing4">
        <TokenLogo
          chainId={fromGraphQLChain(token?.chain) ?? und