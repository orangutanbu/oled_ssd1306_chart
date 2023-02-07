/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* helpful when dealing with deeply nested state objects */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { providers } from 'ethers'
import {
  ChainIdToTxIdToDetails,
  FinalizedTransactionDetails,
  TransactionDetails,
  TransactionId,
  TransactionStatus,
  TransactionType,
} from 'src/features/transactions/types'
import { assert } from 'src/utils/validation'

export interface TransactionState {
  [address: Address]: ChainIdToTxIdToDetails
}

export const initialTransactionsState: TransactionState = {}

const slice = createSlice({
  name: 'transactions',
  initialState: initialTransactionsState,
  reducers: {
    addTransaction: (state, { payload: transaction }: PayloadAction<TransactionDetails>) => {
      const { chainId, id, from } = transaction
      assert(
        !state?.[from]?.[chainId]?.[id],
        `addTransaction: Attempted to overwrite tx with id ${id}`
      )

      state[from] ??= {}
      state[from]![chainId] ??= {}
      state[from]![chainId]![id] = transaction
    },
    updateTransaction: (state, { payload: transaction }: PayloadAction<TransactionDetails>) => {
      const { chainId, id, from } = transaction
      assert(
        state?.[from]?.[chainId]?.[id],
        `updateTransaction: Attempted to update a missing tx with id ${id}`
      )
      state[from]![chainId]![id] = transaction
    },
    finalizeTransaction: (
      state,
      { payload: transaction }: PayloadAction<FinalizedTransactionDetails>
    ) => {
      const { chainId, id, status, receipt, from } = transaction
      assert(
        state?.[from]?.[chainId]?.[id],
        `finalizeTransaction: Attempted to finalize a missing tx with id ${id}`
      )
      state[from]![chainId]![id]!.status = status
      if (receipt) state[from]![chainId]![id]!.receipt = receipt
    },
    cancelTransaction: (
      state,
      {
        payload: { chainId, id, address, cancelRequest },
      }: PayloadAction<
        TransactionId & { address: string; cancelRequest: providers.TransactionRequest }
      >
    ) => {
      assert(
        state?.[addres