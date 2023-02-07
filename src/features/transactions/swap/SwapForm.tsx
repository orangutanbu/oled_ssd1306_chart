// TODO(MOB-3866): reduce component complexity
/* eslint-disable complexity */
import { AnyAction } from '@reduxjs/toolkit'
import React, { Dispatch, memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, StyleSheet, TextInputProps } from 'react-native'
import { FadeIn, FadeOut, FadeOutDown } from 'react-native-reanimated'
import { useAppTheme } from 'src/app/hooks'
import AlertTriangleIcon from 'src/assets/icons/alert-triangle.svg'
import InfoCircle from 'src/assets/icons/info.svg'
import { Button, ButtonSize } from 'src/components/buttons/Button'
import { TouchableArea } from 'src/components/buttons/TouchableArea'
import { CurrencyInputPanel } from 'src/components/input/CurrencyInputPanel'
import { DecimalPad } from 'src/components/input/DecimalPad'
import { AnimatedFlex, Flex } from 'src/components/layout'
import { Box } from 'src/components/layout/Box'
import { SpinningLoader } from 'src/components/loading/SpinningLoader'
import { Warning, WarningAction, WarningSeverity } from 'src/components/modals/WarningModal/types'
import WarningModal, { getAlertColor } from 'src/components/modals/WarningModal/WarningModal'
import { Trace } from 'src/components/telemetry/Trace'
import { Text } from 'src/components/Text'
import { useUSDCPrice, useUSDCValue } from 'src/features/routing/useUSDCPrice'
import { ElementName, ModalName, SectionName } from 'src/features/telemetry/constants'
import { useShouldShowNativeKeyboard } from 'src/features/transactions/hooks'
import { useSwapAnalytics } from 'src/features/transactions/swap/analytics'
import {
  DerivedSwapInfo,
  useShowSwapNetworkNotification,
  useSwapActionHandlers,
} from 'src/features/transactions/swap/hooks'
import { SwapArrowButton } from 'src/features/transactions/swap/SwapArrowButton'
import { isPriceImpactWarning } from 'src/features/transactions/swap/useSwapWarnings'
import {
  getRateToDisplay,
  getReviewActionName,
  isWrapAction,
} from 'src/features/transactions/swap/utils'
import { CurrencyField } from 'src/features/transactions/transactionState/transactionState'
import { createTransactionId } from 'src/features/transactions/utils'
import { BlockedAddressWarning } from 'src/features/trm/BlockedAddressWarning'
import { useIsBlockedActiveAddress } from 'src/features/trm/hooks'
import { formatCurrencyAmount, formatPrice, NumberType } from 'src/utils/format'

interface SwapFormProps {
  dispatch: Dispatch<AnyAction>
  onNext: () => void
  derivedSwapInfo: DerivedSwapInfo
  warnings: Warning[]
  exactValue: string
  showingSelectorScreen: boolean
}

function _SwapForm({
  dispatch,
  onNext,
  derivedSwapInfo,
  warnings,
  exactValue,
  showingSelectorScreen,
}: SwapFormProps): JSX.Element {
  const { t } = useTranslation()
  const theme = useAppTheme()

  const {
    chainId,
    currencies,
    currencyAmounts,
    currencyBalances,
    exactCurrencyField,
    focusOnCurrencyField,
    trade,
    wrapType,
  } = derivedSwapInfo

  const {
    onFocusInput,
    onFocusOutput,
    onSwitchCurrencies,
    onSetExactAmount,
    onSetMax,
    onCreateTxId,
    onShowTokenSelector,
  } = useSwapActionHandlers(dispatch)

  const inputCurrencyUSDValue = useUSDCValue(currencyAmounts[CurrencyField.INPUT])
  const outputCurrencyUSDValue = useUSDCValue(currencyAmounts[CurrencyField.OUTPUT])

  useShowSwapNetworkNotification(chainId)

  const { isBlocked, isBlockedLoading } = useIsBlockedActiveAddress()

  const [showWarningModal, setShowWarningModal] = useState(false)

  const swapDataRefreshing = !isWrapAction(wrapType) && (trade.isFetching || trade.loading)

  const noValidSwap = !isWrapAction(wrapType) && !trade.trade
  const blockingWarning = warnings.some((warning) => warning.action === WarningAction.DisableReview)

  const actionButtonDisabled =
    noValidSwap || blockingWarning || swapDataRefreshing || isBlocked || isBlockedLoading

  const swapWarning = warnings.find((warning) => warning.severity >= WarningSeverity.Low)
  const swapWarningColor = getAlertColor(swapWarning?.severity)

  const onSwapWarningClick = (): void => {
    Keyboard.dismiss()
    setShowWarningModal(true)
  }

  const onReview = useCallback((): void => {
    const txId = createTransactionId()
    onCreateTxId(txId)
    onNext()
  }, [onCreateTxId, onNext])

  const [inputSelection, setInputSelection] = useState<TextInputProps['selection']>()
  const [outputSelection, setOutputSelection] = useState<TextInputProps['selection']>()

  const selection = useMemo(
    () => ({
      [CurrencyField.INPUT]: inputSelection,
      [CurrencyField.OUTPUT]: outputSelection,
    }),
    [inputSelection, outputSelection]
  )
  const resetSelection = useCallback(
    (start: number, end?: number) => {
      if (focusOnCurrencyField === CurrencyField.INPUT) {
        setInputSelection({ start, end: end ?? start })
      } else if (focusOnCurrencyField === CurrencyField.OUTPUT) {
        se