import React from 'react'
import { useTranslation } from 'react-i18next'
import { CurrencyLogo } from 'src/components/CurrencyLogo'
import { Flex } from 'src/components/layout'
import { Text } from 'src/components/Text'
import { ChainId } from 'src/constants/chains'
import { useUSDValue } from 'src/features/gas/hooks'
import { useNativeCurrencyInfo } from 'src/features/tokens/useCurrencyInfo'
import { iconSizes } from 'src/styles/sizing'
import { formatCurrencyAmount, formatUSDPrice, NumberType } from 'src/utils/format'
import { tryParseRawAmount } from 'src/utils/tryParseAmount'

export function SpendingDet