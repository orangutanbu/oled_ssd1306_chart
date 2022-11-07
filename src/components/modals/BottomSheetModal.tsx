import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal as BaseModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet'
import { BlurView } from 'expo-blur'
import React, { ComponentProps, PropsWithChildren, useCallback, useEffect, useRef } from 'react'
import { Keyboard, StyleSheet, useColorScheme } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppTheme } from 'src/app/hooks'
import { HandleBar } from 'src/components/modals/HandleBar'
import { Trace } from 'src/components/telemetry/Trace'
import { ModalName } from 'src/features/telemetry/constants'
import { Te