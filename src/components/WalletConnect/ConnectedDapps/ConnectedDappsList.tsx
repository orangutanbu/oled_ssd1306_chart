import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, ViewStyle } from 'react-native'
import 'react-native-reanimated'
import { FadeIn, FadeOut } from 'react-native-reanimated'
import { useAppTheme } from 'src/app/hooks'
import { AnimatedFlex, Box, Flex } from 'src/components/layout'
import { BackHeader } from 'src/components/layout/BackHeader'
import { Text } from 'src/components/Text'
import { DappConnectionItem } from 'src/components/WalletConnect/ConnectedDapps/DappConnectionItem'
import { DappSwitchNetworkModal } from 'src/components/WalletConnect/ConnectedDapps/DappSwitchNetworkModal'
import {
  WalletConnectSession,
  WalletConnectSessionV1,
} from 'src/features/walletConnect/walletConnectSlice'
import { dimensions } from 'src/styles/sizing'

type ConnectedDappsProps = {
  sessions: WalletConnectSession[]
  backButton?: JSX.Element
}

export function ConnectedDappsList({ backButton, sessions }: ConnectedDappsProps): JSX.Element {
  const { t } = useTranslation()
  const theme = useAppTheme()

  const [selectedSession, setSelectedSession] = useState<WalletConnectSessionV1>()

  const headerText = (
    <Text color="textPrimary" variant="bodyLarge">
      {t('Manage connections')}
    </Text>
  )
  const header = backButton ? (
    <Flex row alignItems="center" justifyContent="space-between">