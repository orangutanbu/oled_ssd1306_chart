import { ThemeProvider } from '@shopify/restyle'
import React, { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Appearance, ColorSchemeName } from 'react-native'
import { useAppSelector } from 'src/app/hooks'
import { selectUserPalette } from 'src/features/wallet/selectors'
import { darkTheme, theme as lightTheme, Theme } from './theme'

const COLOR_SCHEME_FLICKER_DELAY_MS = 250

/** Provides app theme based on active account */
// TODO: [MOB-3922] add back dynamic theming aspect, probably based on Unicon gradient start