import React from 'react'
import { requireNativeComponent, StyleProp, ViewProps } from 'react-native'
import { BoxProps } from 'src/components/layout/Box'
import { dimensions } from 'src/styles/sizing'

interface NativeMnemonicTestProps {
  mnemonicId: Address
  shouldShowSmallText: boolean
  onTestComplete: () => void
}

const NativeMnemonicTest = requireNati