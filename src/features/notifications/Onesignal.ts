import { Linking } from 'react-native'
import OneSignal, { NotificationReceivedEvent, OpenedEvent } from 'react-native-onesignal'
import { config } from 'src/config'
import { getOneSignalUserIdOrError } from 'src/features/firebase/utils'
import { logger } from 'src/utils/logger'

export const initOneSignal = (): void => {
  OneSignal.setLogLevel(6, 0)
  OneSignal.setAppId(config.onesignalAppId)

  OneSignal.setNotificationWillShowInForegroundHandler(async (event: NotificationReceivedEvent) => {
    try {
      // Log to Sentry when a push notification is received while app is open.
      // Used to debug users reporting not receiving notifications.
      const pushId = await getOneSignalUserIdOrError()
      logger.info(
        'Onesignal',
        'NotificationWillShowInForeground',
        `${pushId} received notification while app is open: ${event.getNotification().body}`
      )
    } catch (error) {
      logger.error('Onesignal', 'NotificationWillShowInForeground', 'Error:', error)
    }

    // Complete with undefined means don't show OS notifications while app is in foreground
    event.complete()
  })

  OneSignal.setNotificationOpenedHandler((event: OpenedEvent) => {
    logger.debug(
      'Onesignal',
      'setNotificationOpenedHandler',
      `Notification opened: ${event.notification}`
    )

    // This emits a url even