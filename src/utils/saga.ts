import { createAction, createReducer, PayloadActionCreator } from '@reduxjs/toolkit'
import { call, CallEffect, delay, Effect, put, race, take, TakeEffect } from 'redux-saga/effects'
import { pushNotification } from 'src/features/notifications/notificationSlice'
import { AppNotificationType } from 'src/features/notifications/types'
import { logger } from 'src/utils/logger'
import { errorToString } from 'src/utils/validation'

/**
 * A convenience utility to create a saga and trigger action
 * Use to create simple sagas, for more complex ones use createMonitoredSaga.
 * Note: the wrapped saga this returns must be added to rootSaga.ts
 */
export function createSaga<SagaParams = void>(
  saga: (params: SagaParams) => unknown,
  name: string
): {
  wrappedSaga: () => Generator<Effect, void, unknown>
  actions: {
    trigger: PayloadActionCreator<SagaParams>
  }
} {
  const triggerAction = createAction<SagaParams>(`${name}/trigger`)

  const wrappedSaga = function* (): Generator<
    CallEffect<unknown> | TakeEffect,
    never,
    Effect<unknown, unknown>
  > {
    while (true) {
      try {
        const trigger: Effect = yield take(triggerAction.type)
        logger.debug('saga', 'wrappedSaga', `${name} triggered`)
        yield call(saga, trigger.payload)
      } catch (error) {
        logger.error('saga', 'wrappedSaga', `${name} error`, error)
      }
    }
  }

  return {
    wrappedSaga,
    actions: {
      trigger: triggerAction,
    },
  }
}

const DEFAULT_TIMEOUT = 90 * 1000 // 1.5 minutes

export enum SagaStatus {
  Started = 'SagaStarted',
  Success = 'SagaSuccess',
  Failure = 'SagaFailure',
}

export interface SagaState {
  status: SagaStatus | null
  error: string | null // error details
}

interface MonitoredSagaOptions {
  timeoutDuration?: number // in milliseconds
  suppressErrorNotification?: boolean // disable automatic showing of errors
  // If retry / or other options are ever needed, they can go here
}

/**
 * A convenience utility to create a wrapped saga that handles common concerns like
 * trigger watching, cancel watching, timeout, progress updates, and success/fail updates.
 * Use to create complex sagas that need more coordination with the UI.
 * Note: the wrapped saga and reducer this returns must be added to rootSaga.ts
 */
export function createMonitoredSaga<SagaParams = void>(
  saga: (params: SagaParams) => unknown,
  name: string,
  options?: MonitoredSagaOptions
  // TODO(MOB-3857): Make return type for this function and the one below more explicit and specific.
  // Types are a little tricky with these generator functions.
  // https://stackoverflow.com/questions/66893967/typing-generator-functions-in-redux-saga-with-typescript
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  const triggerAction = createAction<SagaParams>(`${name}/trigger`)
  const cancelAction = createAction<void>(`${name}/cancel`)
  const statusAction = createAction<SagaStatus>(`${name}/progress`)
  const errorAction = createAction<string>(`${name}/error`)
  const resetAction = createAction<void>(`${name}/reset`)

  const reducer = createReducer<SagaState>({ status: null, error: null }, (builder) =>
    builder
      .addCase(statusAction, (state, action) => {
        state.status = action.p