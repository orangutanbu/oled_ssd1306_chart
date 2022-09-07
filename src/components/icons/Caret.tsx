import React, { memo } from 'react'
import { useAppTheme } from 'src/app/hooks'
import CaretChange from 'src/assets/icons/arrow-change.svg'

type Props = {
  size?: number
  direction?: 'n' | 's'
  color?: string
}

export function _Caret({ size = 24, co