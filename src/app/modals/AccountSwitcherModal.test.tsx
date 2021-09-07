import { MockedResponse } from '@apollo/client/testing'
import React from 'react'
import { PreloadedState } from 'redux'
import { AccountSwitcher } from 'src/app/modals/AccountSwitcherModal'
import { RootState } from 'src/app/rootReducer'
import { AccountListDocument, AccountListQuery } from 'src/data/__generated__/types-and-hooks'
import { initialModalState } from 'src/features/modals/modalSlice'
import { ModalName } from 'src/features/telemetry/constants'
import { ACCOUNT_ADDRESS_ONE, mockWalletPreloadedState } from 'src/test/fixtures'
import { Portfolios } from 'src/test/gqlFixtures'
import { render } from 'src/test/test-utils'

jest.useFakeTimers()

const preloadedState = {
  ...mockWalletPreloadedState,
  modals: {
    ...initialModalState,
    [ModalName.AccountSwitcher]: { is