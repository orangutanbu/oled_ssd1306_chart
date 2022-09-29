import { BackgroundColorShorthandProps, createBox } from '@shopify/restyle'
import React, { useMemo } from 'react'
import { View } from 'react-native'
import { NativeSafeAreaViewProps, useSafeAreaInsets } from 'react-native-safe-area-context'
import { BoxProps } from 'src/components/layout/Box'
import { Theme } from 'src/styles/theme'

const SafeAreaBox = createBox<Theme>(View)

type ScreenProps = BackgroundColorShorthandProps<Theme> &
  // The SafeAreaView from react-native-safe-area-context also supports a `mode` prop which
  //  lets you choose if `edges` are added as margin or padding, but we don’t use that so
  // our Screen component doesn't need to support it
  Omit<NativeSafeAreaViewProps, 'mode'> &
  BoxProps

function S