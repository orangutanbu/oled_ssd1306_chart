import { ImpactFeedbackStyle } from 'expo-haptics'
import React, { memo } from 'react'
import { FadeIn, FadeOut } from 'react-native-reanimated'
import { TouchableArea } from 'src/components/buttons/TouchableArea'
import { TokenLogo } from 'src/components/CurrencyLogo/TokenLogo'
import { AnimatedFlex, Flex } from 'src/components/layout'
import { WarmLoadingShimmer } from 'src/components/loading/WarmLoadingShimmer'
import { Text } from 'src/components/Text'
import { RelativeChange } from 'src/components/text/RelativeChange'
import { PortfolioBalance } from 'src/features/dataApi/types'
import { CurrencyId } from 'src/utils/currencyId'
import { formatNumber, formatUSDPrice, NumberType } from 'src/utils/format'

interface TokenBalanceItemProps {
  portfolioBalance: PortfolioBalance
  onPressToken?: (currencyId: CurrencyId, tokenName?: string) => void
  isWarmLoading?: boolean
}

export const TOKEN_BALANCE_ITEM_HEIGHT = 56

export const TokenBala