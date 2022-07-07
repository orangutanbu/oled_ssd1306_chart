import { useNetInfo } from '@react-native-community/netinfo'
import { providers } from 'ethers'
import React, { PropsWithChildren, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'
import { useAppDispatch, useAppTheme } from 'src/app/hooks'
import AlertTriangle from 'src/assets/icons/alert-triangle.svg'
import { AccountDetails } from 'src/components/accounts/AccountDetails'
import { Button, ButtonEmphasis, ButtonSize } from 'src/components/buttons/Button'
import { Box, BoxProps, Flex } from 'src/components/layout'
import { BaseCard } from 'src/components/layout/BaseCard'
import { BottomSheetModal } from 'src/components/modals/BottomSheetModal'
import { NetworkFee } from 'src/components/Network/NetworkFee'
import { Text } from 'src/components/Text'
import { ClientDetails, PermitInfo } from 'src/components/WalletConnect/RequestModal/ClientDetails'
import { useHasSufficientFunds } from 'src/components/WalletConnect/RequestModal/hooks'
import { RequestDetails } from 'src/components/WalletConnect/RequestModal/RequestDetails'
import { useBiometricAppSettings, useBiometricPrompt } from 'src/features/biometrics/hooks'
import { useTransactionGasFee } from 'src/features/gas/hooks'
import { GasSpeed } from 'src/features/gas/types'
import { sendAnalyticsEvent } from 'src/features/telemetry'
import { ElementName, MobileEventName, ModalName } from 'src/features/telemetry/constants'
import { NativeCurrency } from 'src/features/tokens/NativeCurrency'
import { BlockedAddressWarning } from 'src/features/trm/BlockedAddressWarning'
import { useIsBlocked } from 'src/features/trm/hooks'
import { useSignerAccounts } from 'src/features/wallet/hooks'
import { signWcRequestActions } from 'src/features/walletConnect/saga'
import {
  EthMethod,
  isPrimaryTypePermit,
  WCEventType,
  WCRequestOutcome,
} from 'src/features/walletConnect/