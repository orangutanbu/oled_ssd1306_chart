import React, { ComponentProps, useMemo } from 'react'
import { useAppTheme } from 'src/app/hooks'
import { TouchableArea } from 'src/components/buttons/TouchableArea'
import { Arrow } from 'src/components/icons/Arrow'
import { Box } from 'src/components/layout'

type SwapArrowButtonProps = Pick<
  ComponentProps<typeof TouchableArea>,
  'disabled' | 'name' | 'onPress' | 'borderColor' | 'bg'
> & { size?: number }

export function SwapArrowButton(props: SwapArrowButtonProps): JSX.Element {
  const theme = useAppTheme()
  const {
    name,
    onPress,
    disabled,
    bg = 'background1',
    size = theme.iconSizes.icon20,
    ...rest
  } = props
  return useMemo(
    () => (
      <TouchableArea
        hapticFeedback
        alignItems="center"
        alignSelf="center"
        bg={bg}
        borderColor="background1"
        borderRad