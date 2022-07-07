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
} from 'src/features/walletConnect/types'
import { rejectRequest } from 'src/features/walletConnect/WalletConnect'
import {
  isTransactionRequest,
  SignRequest,
  TransactionRequest,
  WalletConnectRequest,
} from 'src/features/walletConnect/walletConnectSlice'
import { iconSizes } from 'src/styles/sizing'
import { toSupportedChainId } from 'src/utils/chainId'
import { buildCurrencyId } from 'src/utils/currencyId'
import { logger } from 'src/utils/logger'

const MAX_MODAL_MESSAGE_HEIGHT = 200

interface Props {
  onClose: () => void
  request: SignRequest | TransactionRequest
}

const isPotentiallyUnsafe = (request: WalletConnectRequest): boolean =>
  request.type !== EthMethod.PersonalSign

const methodCostsGas = (request: WalletConnectRequest): request is TransactionRequest =>
  request.type === EthMethod.EthSendTransaction

/** If the request is a permit then parse the relevant information otherwise return undefined. */
const getPermitInfo = (request: WalletConnectRequest): PermitInfo | undefined => {
  if (request.type !== EthMethod.SignTypedDataV4) {
    return undefined
  }

  try {
    const message = JSON.parse(request.rawMessage)
    if (!isPrimaryTypePermit(message)) {
      return undefined
    }

    const { domain, message: permitPayload } = message
    const currencyId = buildCurrencyId(domain.chainId, domain.verifyingContract)
    const amount = permitPayload.value

    return { currencyId, amount }
  } catch (e) {
    logger.error('WalletConnectRequestModal', 'getPermitInfo', 'invalid JSON message', e)
    return undefined
  }
}

const VALID_REQUEST_TYPES = [
  EthMethod.PersonalSign,
  EthMethod.SignTypedData,
  EthMethod.SignTypedDataV4,
  EthMethod.EthSign,
  EthMethod.EthSignTransaction,
  EthMethod.EthSendTransaction,
]

function SectionContainer({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>): JSX.Element | null {
  return children ? (
    <Box p="spacing16" style={style}>
      {children}
    </Box>
  ) : null
}

const spacerProps: BoxProps = {
  borderBottomColor: 'background1',
  borderBottomWidth: 1,
}

export function WalletConnectRequestModal({ onClose, request }: Props): JSX.Element | null {
  const theme = useAppTheme()
  const netInfo = useNetInfo()
  const chainId = toSupportedChainId(request.dapp.chain_id) ?? undefined

  const tx: providers.TransactionRequest | null = useMemo(() => {
    if (!chainId || !isTransactionRequest(request)) {
      return null
    }

    return { ...request.transaction, chainId }
  }, [chainId, request])

  const signerAccounts = useSignerAccounts()
  const signerAccount = signerAccounts.find((account) => account.address === request.account)
  const gasFeeInfo = useTransactionGasFee(tx, GasSpeed.Urgent)
  const hasSufficientFunds = useHasSufficientFunds({
    account: request.account,
    chainId,
    gasFeeInfo,
    value: isTransactionRequest(request) ? request.transaction.val