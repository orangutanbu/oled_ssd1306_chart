import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, StyleSheet } from 'react-native'
import { useAppDispatch, useAppTheme } from 'src/app/hooks'
import { OnboardingStackParamList } from 'src/app/navigation/types'
import FaceIcon from 'src/assets/icons/faceid.svg'
import FingerprintIcon from 'src/assets/icons/fingerprint.svg'
import { Button, ButtonEmphasis } from 'src/components/buttons/Button'
import { Box, Flex } from 'src/components/layout'
import { BiometricAuthWarningModal } from 'src/components/Settings/BiometricAuthWarningModal'
import { BiometricAuthenticationStatus, tryLocalAuthenticate } from 'src/features/biometrics'
import {
  biometricAuthenticationSuccessful,
  useDeviceSupportsBiometricAuth,
} from 'src/features/biometrics/hooks'
import { setRequiredForTransactions } from 'src/features/biometrics/slice'
import { OnboardingScreen } from 'src/features/onboarding/OnboardingScreen'
import { ImportType } from 'src/features/onboarding/utils'
import { ElementName } from 'src/features/telemetry/constants'
import { OnboardingScreens } from 'src/screens/Screens'
import { openSettings } from 'src/utils/linking'

type Props = NativeStackScreenProps<OnboardingStackParamList, OnboardingScreens.Security>

export function SecuritySetupScreen({ navigation, route: { params } }: Props): JSX.Element {
  const { t } = useTranslation()
  const theme = useAppTheme()
  const dispatch = useAppDispatch()

  const [showWarningModal, setShowWarningModal] = useState(false)
  const { touchId: isTouchIdDevice } = useDeviceSupportsBiometricAuth()
  const authenticationTypeName = isTouchIdDevice ? 'Touch' : 'Face'

  const onPressNext = useCallback(() => {
    setShowWarningModal(false)
    navigation.navigate({ name: OnboardingScreens.Outro, params, merge