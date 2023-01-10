import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { useAppDispatch, useAppTheme } from 'src/app/hooks'
import FiatOnRampBackground from 'src/assets/backgrounds/fiat-onramp-banner.svg'
import { TouchableArea } from 'src/components/buttons/TouchableArea'
import { Chevron } from 'src/components/icons/Chevron'
import { Box, BoxProps, Flex } from 'src/components/layout'
import { Text } from 'src/components/Text'
import { openModal } from 'src/features/modals/modalSlice'
import { MobileEventName, ModalName } from 'src/features/telemetry/constants'

export function FiatOnRampBanner(props: BoxProps): JSX.Element {
  const { t } = useTranslation()
  const theme = useAppTheme()
  const dispatch = useAppDispatch()

  const onPress = (): void => {
    dispatch(openModal({ name: ModalName.FiatOnRamp }))
  }

  return (
    <TouchableArea
      borderRadius="rounded12"
      eventName={MobileEventName.FiatOnRampBannerPressed}
      overflow="hidden"
      p="spacing12"
      style={styles.container}
      onPress={onPress}
      {...props}
      ha