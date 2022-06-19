import { selectionAsync } from 'expo-haptics'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard } from 'react-native'
import { useAppTheme } from 'src/app/hooks'
import Check from 'src/assets/icons/check.svg'
import { TouchableArea } from 'src/components/buttons/TouchableArea'
import { NetworkLogo } from 'src/components/CurrencyLogo/NetworkLogo'
import { Chevron } from 'src/components/icons/Chevron'
import { Flex } from 'src/components/layout'
import { Box } from 'src/components/layout/Box'
import { Separator } from 'src/components/layout/Separator'
import { ActionSheetModal } from 'src/components/modals/ActionSheetModal'
import { useNetworkOptions } from 'src/components/Network/hooks'
import { Text } from 'src/components/Text'
import { ChainId, CHAIN_INFO } from 'src/constants/chains'
import { ElementName, ModalName } from 'src/features/telemetry/constants'
import { iconSizes } from 'src/styles/sizing'

interface NetworkFilterProps {
  selectedChain: ChainId | null
  onPressChain: (chainId: ChainId | null) => void
}

export function NetworkFilter({ selectedChain, onPressChain }: NetworkFilterProps): JSX.Element {
  const theme = useAppTheme()
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)

  const onPress = useCallback(
    (chainId: ChainId | null) => {
      selectionAsync()
      setShowModal(false)
      onPressChain(chainId)
    },
    [setShowModal, onPressChain]
  )

  const networkOptions = useNetworkOptions(selectedChain, onPress)

  const options = useMemo(
    () =>
      [
        {
          key: `${ElementName.NetworkButton}-all`,
          onPress: (): void => {
            setShowModal(false)
            onPressChain(null)
          },
          render: () => (
            <>
              <Separator />
              <Flex
                row
                alignItems="center"
                justifyContent="space-between"
                px="spacing24"
                py="spacing1