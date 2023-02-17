import { useFocusEffect } from '@react-navigation/core'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, TextInput } from 'react-native'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { OnboardingStackParamList } from 'src/app/navigation/types'
import { Button } from 'src/components/buttons/Button'
import { PasswordInput } from 'src/components/input/PasswordInput'
import { Flex } from 'src/components/layout/Flex'
import {
  incrementPasswordAttempts,
  resetLockoutEndTime,
  resetPasswordAttempts,
  setLockoutEndTime,
} from 'src/features/CloudBackup/passwordLockoutSlice'
import { restoreMnemonicFromICloud } from 'src/features/CloudBackup/RNICloudBackupsManager'
import { selectLockoutEndTime, selectPasswordAttempts } from 'src/features/CloudBackup/selectors'
import { importAccountActions, IMPORT_WALLET_AMOUNT } from 'src/features/import/importAccountSaga'
import { ImportAccountType } from 'src/features/import/types'
import { OnboardingScreen } from 'src/features/onboarding/OnboardingScreen'
import { PasswordError } from 'src/features/onboarding/PasswordError'
import { ElementName } from 'src/features/telemetry/constants'
import { OnboardingScreens } from 'src/screens/Screens'
import { ONE_HOUR_MS, ONE_MINUTE_MS } from 'src/utils/time'
import { useAddBackButton } from 'src/utils/useAddBackButton'

type Props = NativeStackScreenProps<
  OnboardingStackParamList,
  OnboardingScreens.RestoreCloudBackupPassword
>

/**
 * If the attempt count does not correspond to a lockout then returns undefined. Otherwise returns the lockout time based on attempts. The lockout time logic is as follows:
 * after 6 attempts, lock out for 5 minutes
 * after 10 attempts, lock out for 15 minutes
 * after 12 attempts and any subsequent multiple of 2, lock out for another 1hr
 */
function calculateLockoutEndTime(attemptCount: number): number | undefined {
  if (attemptCount < 6) {
    return undefined
  }
  if (attemptCount === 6) {
    return Date.now() + ONE_MINUTE_MS * 5
  }
  if (attemptCount < 10) {
    return und