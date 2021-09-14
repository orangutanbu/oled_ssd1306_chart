import { combineReducers, Reducer } from '@reduxjs/toolkit'
import { spawn } from 'redux-saga/effects'
import { cloudBackupsManagerSaga } from 'src/features/CloudBackup/saga'
import { deepLinkWatcher } from 'src/features/deepLinking/handleDeepLink'
import { amplitudeSaga } from 'src/features/experiments/saga'
import { firebaseDataWatcher } from 'src/features/firebase/firebaseData'
import { initFirebase } from 'src/features/firebase/initFirebaseSaga'
import {
  importAccountActions,
  importAccountReducer,
  importAccountSaga,
  importAccountSagaName,
} from 'src/features/import/importAccountSaga'
import { notificationWatcher } from 'src/features/notifications/notificationWatcher'
import { initProviders } from 'src/features/providers/providerSaga'
import {
  swapActions,
  swapReducer,
  swapSaga,
  swapSagaName,
} from 'src/features/transactions/swap/swapSaga'
import {
  tokenWrapActions,
  tokenWrapReducer,
  tokenWrapSaga,
  tokenWrapSagaName,
} from 'src/features/transactions/swap/wrapSaga'
import { transactionWatcher } from 'src/features/transactions/transactionWatcherSaga'
import {
  transferTokenActions