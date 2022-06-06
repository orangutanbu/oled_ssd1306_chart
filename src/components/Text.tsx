import { createText, useResponsiveProp } from '@shopify/restyle'
import React, { ComponentProps, PropsWithChildren } from 'react'
import { useWindowDimensions } from 'react-native'
import Animated from 'react-native-reanimated'
import { Box } from 'src/components/layout'
import { Shimmer } from 'src/components/loading/Shimmer'
import { HiddenFromScreenReaders } from 'src/components/text/HiddenFromScreenReaders'
import { textVariants } from 'src/styles/font'
import { Theme } from 'src/styles/theme'

export const DEFAULT_FONT_SCALE = 1

export type TextProps = ComponentProps<typeof ThemedText> & {
  maxFontSizeMultiplier?: number
  animated?: boolean
  allowFontScaling?: boolean
  loading?: boolean | 'no-shimmer'
  loadingPlaceholderText?: string
}

// Use this text component throughout the app instead of
// Default RN Text for theme support
const ThemedText = createText<Theme>()
const ThemedAnimatedText = createText<Theme>(Animated.Text)

const TextPlaceholder = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
  return (
    <Box alignItems="center" flexDirection="row">
      <Box alignItems="center" flexDirection="row" position="relative">
        <HiddenFromScreenReaders>{children}</HiddenFromScreenReaders>
        <Box
          bg="background3"
          borderRadius="rounded4"
          bottom="5%"
          left={0}
          position="absolute"
          right={0}
          top="5%"
        />
      </Box>
    </Box>
  )
}

const TextLoaderWrapper = ({
  children,
  loadingShimmer,
}: { loadingShimmer?: boolean } & PropsWithChildren<unknown>): JSX.Element => {
  const inner = <TextPlaceholder>{children}</TextPlaceholder>
  if (loadingShimmer) {
    return <Shimmer>{inner}</Shimmer>
  }

  return inner
}

/**
 * Use this component instead of the default React Native <Text> component anywhere text shows up throughout the app, so we can use the design system values for colors and sizes, and make sure all text looks and behaves the same way
 * @param loading Whether the text inside the component is still loading or not. Set this to true if whatever content goes inside the <Text> component is coming from a variable that might still be loading. This prop is optional and defaults to false. This pr