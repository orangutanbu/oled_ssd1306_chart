import { appSelect } from 'src/app/hooks'
import { selectPendingAccounts } from 'src/features/wallet/selectors'
import { markAsNonPending, removeAccounts } from 'src/features/wallet/walletSlice'
import { logger } from 'src/utils/logger'
import { createMonitoredSaga } from 'src/utils/saga'
import { put } from 'typed-redux-saga'

export enum PendingAcc