import { useFocusEffect } from '@react-navigation/core'
import { SharedEventName } from '@uniswap/analytics-events'
import React, { createContext, memo, PropsWithChildren, useEffect, useMemo, useRef } from 'react'
import { useIsPartOfNavigationTree } from 'src/app/navigation/hooks'
import { sendAnalyticsEvent } from 'src/features/telemetry'
import { ElementName, MarkNames, ModalName, SectionName } from 'src/features/telemetry/constants'
import { useTrace } from 'src/features/telemetry/hooks'
import { AppScreen, Screens } from 'src/screens/Screens'
import { logger } from 'src/utils/logger'

export interface ITraceContext {
  screen?: AppScreen

  // Enclosed section name. Can be as wide or narrow as necessary to
  // provide telemetry context.
  section?: SectionName

  modal?: ModalName

  element?: ElementName

  // Keeps 