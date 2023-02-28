import { useEffect, useRef } from 'react'
import { AppState, AppStateStatus } from 'react-native'

/** Invokes `callback` when app state goes from `from` to `to`. */
export function useAppStateTrigger(
  from: AppStateStatus,
  to: AppStateStatus,
  callback: () => void
): void {
  const appState = useRef(AppState.currentState)

  useEffect(() => {
    const subscrip