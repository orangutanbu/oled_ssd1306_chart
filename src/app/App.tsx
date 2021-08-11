
import { ApolloProvider } from '@apollo/client'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import * as Sentry from '@sentry/react-native'
import { PerformanceProfiler, RenderPassReport } from '@shopify/react-native-performance'
import * as SplashScreen from 'expo-splash-screen'
import React, { StrictMode, useCallback, useEffect, useState } from 'react'
import { StatusBar, useColorScheme } from 'react-native'
import { getUniqueId } from 'react-native-device-info'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ErrorBoundary } from 'src/app/ErrorBoundary'
import { AppModals } from 'src/app/modals/AppModals'
import { AppStackNavigator } from 'src/app/navigation/navigation'
import { NavigationContainer } from 'src/app/navigation/NavigationContainer'
import { persistor, store } from 'src/app/store'
import { WalletContextProvider } from 'src/app/walletContext'
import { OfflineBanner } from 'src/components/banners/OfflineBanner'
import { Trace } from 'src/components/telemetry/Trace'
import { TraceUserProperties } from 'src/components/telemetry/TraceUserProperties'
import { config } from 'src/config'
import { usePersistedApolloClient } from 'src/data/hooks'
import { LockScreenContextProvider } from 'src/features/authentication/lockScreenContext'
import { BiometricContextProvider } from 'src/features/biometrics/context'
import { NotificationToastWrapper } from 'src/features/notifications/NotificationToastWrapper'
import { initOneSignal } from 'src/features/notifications/Onesignal'
import { initializeRemoteConfig } from 'src/features/remoteConfig'
import { sendAnalyticsEvent } from 'src/features/telemetry'
import { MobileEventName } from 'src/features/telemetry/constants'
import { TransactionHistoryUpdater } from 'src/features/transactions/TransactionHistoryUpdater'
import { useTrmPrefetch } from 'src/features/trm/api'
import { useSignerAccounts } from 'src/features/wallet/hooks'
import { DynamicThemeProvider } from 'src/styles/DynamicThemeProvider'
import { useAppStateTrigger } from 'src/utils/useAppStateTrigger'
import { getStatsigEnvironmentTier } from 'src/utils/version'
import { StatsigProvider } from 'statsig-react-native'

// Keep the splash screen visible while we fetch resources until one of our landing pages loads
SplashScreen.preventAutoHideAsync()

// Construct a new instrumentation instance. This is needed to communicate between the integration and React
const routingInstrumentation = new Sentry.ReactNavigationInstrumentation()

// Dummy key since we use the reverse proxy will handle the real key
const DUMMY_STATSIG_SDK_KEY = 'client-0000000000000000000000000000000000000000000'

if (!__DEV__) {
  Sentry.init({
    dsn: config.sentryDsn,
    tracesSampler: (_) => {
      return 0.2
    },
    integrations: [
      new Sentry.ReactNativeTracing({
        // Pass instrumentation to be used as `routingInstrumentation`
        routingInstrumentation,
      }),
    ],
  })
}