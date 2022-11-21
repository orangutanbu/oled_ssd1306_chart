import { ResponsiveValue } from '@shopify/restyle'
import React from 'react'
import { Modal as BaseModal, ModalProps, StyleSheet, View } from 'react-native'
import { CloseButton } from 'src/components/buttons/CloseButton'
import { TouchableArea } from 'src/components/buttons/TouchableArea'
import { Box } from 'src/components/layout/Box'
import { Text } from 'src/components/Text'
import { Theme } from 'src/styles/theme'

interface Props extends ModalProps {
  position?: 'top' | 'center' | 'bottom'
  title?: string
  hide?: () => void
  dismissable?: boolean
  showCloseButton?: boole