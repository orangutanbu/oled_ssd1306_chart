import React, { useMemo } from 'react'
import { useAppTheme } from 'src/app/hooks'
import ExternalLinkIcon from 'src/assets/icons/external-link.svg'
import { BaseButtonProps, TouchableArea } from 'src/components/buttons/TouchableArea'
import { Flex } from 'src/components/layout'
import { Text } from 'src/components/Text'
import { iconSizes } from 'src/styles/sizing'
import { Theme } from 'src/styles/theme'
import { openUri } from 'src/utils/linking'

interface LinkButtonProps extends Omit<BaseButtonProps, 'onPress'> {
  label: string
  url: string
  openExternalBrowser?: boolean
  isSafeUri?: boolean
  color?: string
  iconColor?: string
  size?: number
  textVariant?: keyof Theme['textVariants']
}

export function LinkButton({
  url,
  label,
  textVariant,
  color,
  iconColor,
  openExternalBrowser = false,
  isSafeUri = false,
  size = iconSizes.icon20,
  justifyContent = 'center',
  ...rest
}: LinkButtonProps): JSX.Element {
  const theme = useAppTheme()
  const colorStyles = useMemo(() =>