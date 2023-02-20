import {
  Blur,
  Canvas,
  Group,
  Oval,
  RoundedRect,
  SkiaValue,
  useSharedValueEffect,
  useValue,
} from '@shopify/react-native-skia'
import { useResponsiveProp } from '@shopify/restyle'
import { ResizeMode, Video } from 'expo-av'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, useColorScheme, View, ViewStyle } from 'react-native'
import Animated, {
  AnimateStyle,
  Easing,
  EntryExitAnimationFunction,
  runOnJS,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { useAppTheme } from 'src/app/hooks'
import { ONBOARDING_QR_ETCHING_VIDEO_DARK, ONBOARDING_QR_ETCHING_VIDEO_LIGHT } from 'src/assets'
import { Button } from 'src/components/buttons/Button'
import { GradientBackground } from 'src/components/gradients/GradientBackground'
import { UniconThemedGradient } from 'src/components/gradients/UniconThemedGradient'
import { Box, Flex } from 'src/components/layout'
import { QRCodeDisplay } from 'src/components/QRCodeScanner/QRCode'
import { Text } from 'src/components/Text'
import { useUniconColors } from 'src/components/unicons/utils'
import { ElementName } from 'src/features/telemetry/constants'
import {
  flashWipeAnimation,
  letsGoButtonFadeIn,
  qrInnerBlurConfig,
  qrScaleIn,
  qrSlideUpAndFadeInConfig,
  qrSlideUpAtEnd,
  realQrFadeIn,
  realQrTopGlowFadeIn,
  textSlideUpAtEnd,
  videoFadeOut,
} from 'src/screens/Onboarding/OnboardingCompleteAnimation/animations'
import { flex } from 'src/styles/flex'

export function OnboardingCompleteAnimation({
  activeAddress,
  isNewWallet,
  onPressNext,
}: {
  activeAddress: string
  isNewWallet: boolean
  onPressNext: () => void
}): JSX.Element {
  const theme = useAppTheme()
  const { t } = useTranslation()
  const video = useRef<Video>(null)

  const playEtchingAfterSlideIn = (): void => {
    video.current?.playAsync()
  }

  const isDarkMode = useColorScheme() === 'dark'

  const etchingVideoSource = isDarkMode
    ? ONBOARDING_QR_ETCHING_VIDEO_DARK
    : ONBOARDING_QR_ETCHING_VIDEO_LIGHT

  // 2. QR slide up and fade in animation
  // the config for this animation is defined in the animations.ts file in the same folder as this component, but because of the callback it made more sense to leave the actual animation definition in this file
  const qrSlideUpAndFadeIn: EntryExitAnimationFunction = () => {
    'worklet'
    const animations: AnimateStyle<StyleProp<ViewStyle>> = {
      opacity: withDelay(
        qrSlideUpAndFadeInConfig.opacity.delay,
        withTiming(qrSlideUpAndFadeInConfig.opacity.endValue, {
          duration: qrSlideUpAndFadeInConfig.opacity.duration,
          easing: Easing.bezierFn(0.22, 1.0, 0.36, 1.0),
        })
      ),
      transform: [
        {
          translateY: withDelay(
            qrSlideUpAndFadeInConfig.translateY.delay,
            withTiming(qrSlideUpAndFadeInConfig.translateY.endValue, {
              duration: qrSlideUpAndFadeInConfig.translateY.duration,
              easing: Easing.bezierFn(0.22, 1.0, 0.36, 1.0),
            })
          ),
        },
      ],
    }
    // <StyleProp<ViewStyle>> doesn't quite work because of translateY
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const initialValues: AnimateStyle<any> = {
      opacity: qrSlideUpAndFadeInConfig.opacity.startValue,
      transform: [{ translateY: qrSlideUpAndFadeInConfig.translateY.startValue }],
    }
    const callback = (finished: boolean): void => {
      if (finished) {
        runOnJS(playEtchingAfterSlideIn)()
      }
    }
    return {
      initialValues,
      animations,
      callback,
    }
  }

  // 4. QR code inner glow animation
  const reOpacity = useSharedValue(qrInnerBlurConfig.opacity.startValue)
  const preglowBlurOpacity = useValue(qrInnerBlurConfig.opacity.startValue)

  const reSize = useSharedValue(qrInnerBlurConfig.size.startValue)
  const preglowBlurSize = useValue(qrInnerBlurConfig.size.startValue)

  useEffect(() => {
    reOpacity.value = withDelay(
      qrInnerBlurConfig.opacity.delay,
      withTiming(qrInnerBlurConfig.opacity.endValue, {
        duration: qrInnerBlurConfig.opacity.duration,
      })
    )
  }, [reOpacity])

  useEffect(() => {
    reSize.value = withDelay(
      qrInnerBlurConfig.size.delay,
      withTiming(qrInnerBlurConfig.size.endValue, { duration: qrInnerBlurConfig.size.duration })
    )
  }, [reSize])

  // in order to animate React Native Skia values, we need to bind the Reanimated values to the React Native Skia values ("ra" = "reanimated")
  useSharedValueEffect(() => {
    preglowBlurOpacity.current = reOpacity.value
  }, reOpacity)

  useSharedValueEffect(() => {
    preglowBlurSize.current = reSize.value
  }, reSize)

  const uniconColors = useUniconColors(activeAddress)

  // used throughout the page the get the size of the QR code container
  // setting as a constant so that it doesn't get defined by padding and screen size and give us less design control
  const QR_CONTAINER_SIZE = 242
  const QR_CODE_SIZE = 190

  const UNICON_SIZE = 48

  const finalTitleMaxFontSizeMultiplier = useResponsiveProp({
    xs: 1.1,
    sm: theme.textVariants.headlineSmall.maxFontSizeMultiplier,
  })

  const finalBodyMaxFontSiz