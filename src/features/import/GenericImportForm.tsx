
import { ResponsiveValue, useResponsiveProp } from '@shopify/restyle'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LayoutChangeEvent,
  LayoutRectangle,
  StyleSheet,
  TextInput as NativeTextInput,
  View,
} from 'react-native'
import { useAppTheme } from 'src/app/hooks'
import AlertTriangle from 'src/assets/icons/alert-triangle.svg'
import PasteButton from 'src/components/buttons/PasteButton'
import { TextInput } from 'src/components/input/TextInput'
import { Box, Flex } from 'src/components/layout'
import { Trace } from 'src/components/telemetry/Trace'
import { Text } from 'src/components/Text'
import { Theme } from 'src/styles/theme'
import { SectionName } from '../telemetry/constants'

interface Props {
  value: string | undefined
  errorMessage: string | undefined
  onChange: (text: string | undefined) => void
  placeholderLabel: string | undefined
  onSubmit?: () => void
  showSuccess?: boolean // show success indicator
  inputSuffix?: string //text to auto to end of input string
  liveCheck?: boolean
  autoCorrect?: boolean
  inputAlignment?: ResponsiveValue<'center' | 'flex-start', Theme>
  onBlur?: () => void
  onFocus?: () => void
  beforePasteButtonPress?: () => void
  afterPasteButtonPress?: () => void
  blurOnSubmit?: boolean
}

export function GenericImportForm({
  value,
  onChange,
  errorMessage,
  placeholderLabel,
  onSubmit,
  showSuccess,
  inputSuffix,
  liveCheck,
  autoCorrect,
  onBlur,
  onFocus,
  beforePasteButtonPress,
  afterPasteButtonPress,
  blurOnSubmit,
  inputAlignment = 'center',
}: Props): JSX.Element {
  const { t } = useTranslation()
  const theme = useAppTheme()
  const [focused, setFocused] = useState(false)
  const [layout, setLayout] = useState<LayoutRectangle | null>()
  const textInputRef = useRef<NativeTextInput>(null)

  const INPUT_FONT_SIZE = theme.textVariants.bodyLarge.fontSize
  const INPUT_MAX_FONT_SIZE_MULTIPLIER = theme.textVariants.bodyLarge.maxFontSizeMultiplier

  const minHeight = useResponsiveProp({ xs: 90, sm: 120 })
  const px = useResponsiveProp({ xs: 'spacing24', sm: 'spacing36' })
  const py = useResponsiveProp({ xs: 'spacing8', sm: 'spacing16' })

  const handleBlur = (): void => {
    setFocused(false)
    onBlur?.()
  }

  const handleFocus = (): void => {
    setFocused(true)
    onFocus?.()
    // Need this to allow for focus on click on container.
    textInputRef?.current?.focus()
  }

  const handleSubmit = (): void => {
    onSubmit && onSubmit()
  }

  return (