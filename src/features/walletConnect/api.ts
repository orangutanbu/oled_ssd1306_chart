import { logger } from 'src/utils/logger'

// TODO: [MOB-3915] Change to production server endpoint for push server, currently using test endpoints
const WC_PUSH_SERVER_BASE_URL = 'https://us-central1-uniswap-mobile.cloudfunctions.net'
const WC_REGISTER_ENDPOINT = 'onWalletConnectRegistration'
const WC_DEREGISTER_ENDPOINT = 'onWalletConnectDeregistration'

export type RegisterWcPushNotificationParams