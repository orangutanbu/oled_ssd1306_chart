import {
  BlurMask,
  Canvas,
  Circle,
  Color,
  Group,
  LinearGradient,
  Mask,
  Path,
  Rect,
  vec,
} from '@shopify/react-native-skia'
import React, { memo, useMemo } from 'react'
import { useColorScheme } from 'react-native'
import 'react-native-reanimated'
import { Box } from 'src/components/layout'
import {
  blurs,
  UniconAttributeD