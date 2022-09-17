/* eslint-disable @typescript-eslint/no-explicit-any */
// Adds ForwardRef to Animated.FlaList
// https://github.com/software-mansion/react-native-reanimated/issues/2976

import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import React, { forwardRef } from 'react'
import { FlatList, FlatListProps, LayoutChangeEvent, View } from 'react-native'
import Animated, { ILayoutAnimationBuilder } from 'react-native-reanimated'

// difficult to properly type
const ReanimatedFlatList = Animated.createAnimatedComponent(FlatList as any) as any
const ReanimatedBottomSheetFlatList = Animated.createAnimatedComponent(
  BottomSheetFlatList as any
) as any
const AnimatedView = Animated.createAnimatedComponent(View)

const createCellRenderer = (
  itemLayoutAnimation?: ILayoutAnimationBuilder
): React.FC<{
  onLayout: (event: LayoutChangeEvent) => void
}> => {
  const cellRenderer: React.FC<{
    onLayout: (event: LayoutChangeEvent) => void
  }> = (props) => {
    return (
      <AnimatedView layout={itemLayoutAnimation as never} onLayout={props.onLayout}>
        {props.children}
      </Animated