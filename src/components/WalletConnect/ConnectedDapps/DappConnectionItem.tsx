import React from 'react'
import { useTranslation } from 'react-i18next'
import { useColorScheme } from 'react-native'
import 'react-native-reanimated'
import { useAppTheme } from 'src/app/hooks'
import { TouchableArea } from 'src/components/buttons/TouchableArea'
import { NetworkLogo } from 'src/components/CurrencyLogo/NetworkLogo'
import { Chevron } from 'src/components/icons/Chevron'
import { Box, Flex } from 'src/components/layout'
import { Text } from 'src/components/Text'
import { DappHeaderIcon } from 'src/components/WalletConnect/DappHeaderIcon'
import { CHAIN_INFO } from 'src/constants/chains'
import { ElementName } from 'src/features/telemetry/constants'
import {
  WalletConnectSession,
  WalletConnectSessionV1,
} from 'src/features/walletConnect/walletConnectSlice'
import { toSupportedChainId } from 'src/utils/chainId'
import { openUri } from 'src/utils/linking'

export function DappConnectionItem({
  session,
  onPressChangeNetwork,
}: {
  session: WalletConnectSession
  onPressChangeNetwork: (session: WalletConnectSessionV1) => void
}): JSX.Element {
  const theme = useAppTheme()
  const { dapp } = session

  return (
    <Flex
      bg="background2"
      borderRadius="rounded16"
      gap="spacing16"
      justifyContent="space-between"
      mb="spacing12"
      px="spacing12"
   