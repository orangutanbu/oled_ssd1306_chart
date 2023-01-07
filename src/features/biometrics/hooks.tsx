import {
  AuthenticationType,
  hasHardwareAsync,
  isEnrolledAsync,
  supportedAuthenticationTypesAsync,
} from 'expo-local-authentication'
import { useAppSelector } from 'src/app/hooks'
import { BiometricAuthenticationStatus, tryLocalAuthenticate } from 'src/features/biometrics'
import { useBiometricContext } from 'src/features/biometrics/context'
import { BiometricSettingsState } from 'src/features/biometrics/slice'
import { useAsyncData } from 'src/utils/hooks'

/**
 * Hook shortcut to use the biometric pro