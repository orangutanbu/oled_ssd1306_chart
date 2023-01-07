import { expectSaga } from 'redux-saga-test-plan'
import {
  handleDeepLink,
  parseAndValidateUserAddress,
} from 'src/features/deepLinking/handleDeepLink'
import { handleTransactionLink } from 'src/features/deepLinking/handleTransactionLink'
import { sendAnalyticsEvent } from 'src/features/telemetry'
import { MobileEventName } from 'src/features/telemetry/constants'
import { activateAccount } from 'src/features/wallet/w