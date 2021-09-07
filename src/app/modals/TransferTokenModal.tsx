import React, { useCallback } from 'react'
import { useAppDispatch, useAppSelector, useAppTheme } from 'src/app/hooks'
import { BottomSheetModal } from 'src/components/modals/BottomSheetModal'
import { closeModal, selectModalState } from 'src/features/modals/modalSlice'
import { ModalName } from 'src/features/telemetry/constants'
import { TransferFlow } from 'src/features/transactions/transfer/TransferFlow'

export function TransferTokenModal(): JSX.Element {
  const theme = useAppTheme()
  const appDispatch = useAppDispatch()
  const modalState = useAppSelector(selectModalState(ModalName.Send))
