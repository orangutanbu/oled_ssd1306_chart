
import { useFocusEffect } from '@react-navigation/core'
import { useResponsiveProp } from '@shopify/restyle'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useColorScheme, ViewStyle } from 'react-native'
import Rive, { Alignment, Fit, RiveRef } from 'rive-react-native'
import { useAppStackNavigation } from 'src/app/navigation/types'
import { useTimeout } from 'src/utils/timing'

const stateMachineName = 'State Machine 1'

const animationStyles: ViewStyle = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
}

const OnboardingAnimation = (): JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark'
  const animationRef = useRef<RiveRef>(null)
  const fitValue = useResponsiveProp({ xs: Fit.FitWidth, sm: Fit.FitHeight })

  return (
    <Rive
      ref={animationRef}
      alignment={Alignment.TopCenter}
      animationName="Intro"
      artboardName="Unified"
      fit={fitValue}
      resourceName={isDarkMode ? 'OnboardingDark' : 'OnboardingLight'}
      stateMachineName={stateMachineName}
      style={animationStyles}
    />
  )
}