import { SharedEventName } from '@uniswap/analytics-events'
import React from 'react'
import { Route, TabView, TabViewProps } from 'react-native-tab-view'
import { sendAnalyticsEvent } from 'src/features/telemetry'
import { SectionName } from 'src/features/telemetry/constants'
import { Screens } from 'src/screens/Screens'

type TraceRouteProps = { key: SectionName } & Route

export default function TraceTabView<T extends TraceRouteProps>({
  onIndexChange,
  navigationState,
  screenName,
  ...rest
}: TabViewProps<T> & { screenName: Screens }): JSX.Element {
  const onIndexChangeTrace = (index: number): void => {
    sendA