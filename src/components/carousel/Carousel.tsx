import React, { ComponentProps, createContext, ReactNode, useCallback, useRef } from 'react'
import { ListRenderItemInfo } from 'react-native'
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import { AnimatedIndicator } from 'src/components/carousel/Indicator'
import { Flex } from 'src/components/layout'
import { AnimatedFlatList } from 'src/components/layout/AnimatedFlatList'
import { dimensions } from 'src/styles/sizing'

const { fullWidth } = dimensions

interface CarouselContextProps {
  current: number
  goToNext: () => void
  goToPrev: () => void
}

// Allows child components to control the carousel
export const CarouselContext = createContext<CarouselContextProps>({
  goToNext: () => undefined,
  goToPrev: () => undefined,
  current: 0,
})

type CarouselProps = {
  slides: JSX.Element[]
} & Pick<ComponentProps<typeof Animated.FlatList>, 'scrollEnabled'>

export const Carousel = ({ slides, ...flatListProps }: CarouselProps): JSX.Element => {
  const scroll = useSharedValue(0)
  const myRef = useRef<Animated.FlatList<unknown>>(null)

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scroll.value = event.contentOffset.x
    },
  })

  const goToNext = useCallback(() => {
    // @ts-expect-error https://github.com/software-mansion/react-native-reanimated/issues/2976
    myRef.current?._listRef._scrollRef.scrollTo({
      x: scroll.value + fullWidth,
    })
  }, [scroll.value])

  const goToPrev = useCallback(() => {
    // @ts-expect-error https://github.com/software-mansion/react-native-reanimated/issues/2976
    myRe