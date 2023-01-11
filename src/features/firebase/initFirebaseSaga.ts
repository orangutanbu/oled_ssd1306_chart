import firebase from '@react-native-firebase/app'
import '@react-native-firebase/auth'
import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { CallEffect } from 'redux-saga/effects'
import { logger } from 'src/utils/logger'
import { call } from 'typed-redux-saga'

export function* initFirebase(): Generator<CallEffect<void>, void, unknown> {
  yield* call(anonFir