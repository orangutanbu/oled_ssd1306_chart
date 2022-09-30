
import { useScrollToTop } from '@react-navigation/native'
import React, { ReactElement, useMemo } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BackButton } from 'src/components/buttons/BackButton'