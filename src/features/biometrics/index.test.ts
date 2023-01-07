import { authenticateAsync, hasHardwareAsync, isEnrolledAsync } from 'expo-local-authentication'
import { BiometricAuthenticationStatus, tryLocalAuthenticate } from 'src/features/biometrics'
import { isEnabled } from 'src/features/remoteConfig'

jest.mock('expo-local-authentication')
jest.mock('src/features/remoteConfig')

const mockedHasHardwareAsync = <jest.MockedFunction<typeof hasHardwareAsync>>hasHardwareAsync
const mockedIsEnrolledAsync = <jest.MockedFunction<typeof isEnrolledAsync>>isEnrolledAsync
const mockedAuthenticateAsync = <jest.MockedFunction<typeof authenticateAsync>>authenticateAsync

const mockedIsEnabled = <jest.MockedFunction<typeof isEnabled>>isEnabled

describe(tryLoc