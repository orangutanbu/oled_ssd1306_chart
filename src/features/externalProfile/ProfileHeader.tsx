import { LinearGradient } from 'expo-linear-gradient'
import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, useColorScheme } from 'react-native'
import { FadeIn } from 'react-native-reanimated'
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg'
import { useAppDispatch, useAppSelector, useAppTheme } from 'src/app/hooks'
import HeartIcon from 'src/assets/icons/heart.svg'
import SendIcon from 'src/assets/icons/send-action.svg'
import { AddressDisplay } from 'src/components/AddressDisplay'
import { BackButton } from 'src/components/buttons/BackButton'
import { TouchableArea } from 'src/components/buttons/TouchableArea'
import { AnimatedBox, Box } from 'src/components/layout/Box'
import { Flex } from 'src/components/layout/Flex'
import { Text } from 'src/components/Text'
import { useUniconColors } from 'src/components/unicons/utils'
import { useENSAvatar } from 'src/features/ens/api'
import { ProfileContextMenu } from 'src/features/externalProfile/ProfileContextMenu'
import { useToggleWatchedWalletCallback } from 'src/features/favorites/hooks'
import { selectWatchedAddressSet } from 'src/features/favorites/selectors'
import { openModal } from 'src/features/modals/modalSlice'
import { ElementName, ModalName } from 'src/features/telemetry/constants'
import { CurrencyField } from 'src/features/transactions/transactionState/transactionState'
import { iconSizes } from 'src/styles/sizing'
import { useExtractedColors } from 'src/utils/colors'

const HEADER_GRADIENT_HEIGHT = 137
const HEADER_ICON_SIZE = 72

interface ProfileHeaderProps {
  address: Address
}

export default function ProfileHeader({ address }: ProfileHeaderProps): JSX.Element {
  const theme = useAppTheme()
  const dispatch = useAppDispatch()
  const isFavorited = useAppSelector(selectWatchedAddressSet).has(address)

  // ENS avatar and avatar colors
  const { data: avatar, isLoading } = useENSAvatar(address)
  const { colors: avatarColors } = useExtractedColors(avatar)
  const hasAvatar = !!avatar && !isLoading

  // Unicon colors
  const { gradientStart: uniconGradientStart, gradientEnd: uniconGradientEnd } =
    useUniconColors(address)

  // Wait for avatar, then render avatar extracted colors or unicon colors if no avatar
  const fixedGradientColors = useMemo(() => {
    if (isLoading || (hasAvatar && !avatarColors)) {
      return [theme.colors.background0, theme.colors.background0]
    }
    if (hasAvatar && avatarColors) {
      return [avatarColors.background, avatarColors.background]
    }
    return [uniconGradientStart, uniconGradientEnd]
  }, [
    avatarColors,
    hasAvatar,
    isLoading,
    theme.colors.background0,
    uniconGradientEnd,
    uniconGradientStart,
  ])

  const onPressFavorite = useToggleWatchedWalletCallback(address)

  const initialSendState = useMemo(() => {
    return {
      recipient: address,
      exactAmount