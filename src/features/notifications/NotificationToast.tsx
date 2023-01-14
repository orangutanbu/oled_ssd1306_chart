import React, { useCallback, useEffect } from 'react'
import {
  Directions,
  FlingGestureHandler,
  FlingGestureHandlerGestureEvent,
  State,
} from 'react-native-gesture-handler'
import { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { TouchableArea } from 'src/components/buttons/TouchableArea'
import { AnimatedBox, Flex } from 'src/components/layout'
import { Text } from 'src/components/Text'
import { popNotification } from 'src/features/notifications/notificationSlice'
import { selectActiveAccountNotifications } from 'src/features/notifications/selectors'
import { useTimeout } from 'src/utils/timing'

const NOTIFICATION_HEIGHT = 64

const DEFAULT_HIDE_DELAY = 5000 // 5 seconds
const HIDE_OFFSET_Y = -150
const SPRING_ANIMATION = { damping: 30, stiffness: 150 }

export interface NotificationContentProps {
  title: string
  icon?: JSX.Element
  balanceUpdate?: JSX.Element
  actionButton?: {
    title: string
    onPress: () => void
  }
  onPress?: () => void
  onPressIn?: () => void
}

export interface NotificationToastProps extends NotificationContentProps {
  hideDelay?: number // If omitted, the default delay time is used
  address?: string
  useSmallDisplay?: boolean // for compressed toasts with only icon and text
}

export function NotificationToast({
  title,
  icon,
  balanceUpdate,
  onPress,
  onPressIn,
  hideDelay,
  actionButton,
  address,
  useSmallDisplay,
}: NotificationToastProps): JSX.Element {
  const dispatch = useAppDispatch()
  const notifications = useAppSelector(selectActiveAccountNotifications)
  const currentNotification = notifications[0]
  const hasQueuedNotification = !!notifications[1]

  const showOffset = useSafeAreaInsets().top
  const bannerOffset = useSharedValue(HIDE_OFFSET_Y)

  useEffect(() => {
    if (currentNotification) {
      bannerOffset.value = withDelay(100, withSpring(showOffset, SPRING_ANIMATION))
    }
  }, [showOffset, bannerOffset, currentNotification])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bannerOffset.value }],
  }))

  const dismissLatest = useCallback(() => {
    bannerOffset.value = withSpring(HIDE_OFFSET_Y, SPRING_ANIMATION)
    setTimeout(() => dispatch(popNotification({ address })), 500)
    if (notifications.length > 1) {
      bannerOffset.value = withDelay(100, withSpring(showOffset, SPRING_ANIMATION))
    }
  }, [address, bannerOffset, dispatch, notifications, showOffset])

  // If there is another notification in the queue then hide the current one immedia