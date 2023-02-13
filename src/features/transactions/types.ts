import { TradeType } from '@uniswap/sdk-core'
import { providers } from 'ethers'
import { ChainId, ChainIdTo } from 'src/constants/chains'
import { TransactionListQuery } from 'src/data/__generated__/types-and-hooks'
import { AssetType } from 'src/entities/assets'
import { MoonpayCurrency } from 'src/features/fiatOnRamp/types'
import { DappInfo } from 'src/features/walletConnect/types'

export type ChainIdToTxIdToDetails = ChainIdTo<{ [txId: string]: TransactionDetails }>

// Basic identifying info for a transaction
export interface TransactionId {
  chainId: ChainId
  id: string
}

export type TransactionListQueryResponse = NonNullable<
  NonNullable<NonNullable<TransactionListQuery['portfolios']>[0]>['assetActivities']
>[0]

export interface TransactionDetails extends TransactionId {
  from: Address

  // Specific info for the tx type
  typeInfo: TransactionTypeInfo

  // Info for status tracking
  status: TransactionStatus
  addedTime: number
  // Note: hash is mandatory for now but may be made optional if
  // we start tracking txs before they're actually sent
  hash: string

  // Info for submitting the tx
  options: TransactionOptions

  receipt?: TransactionReceipt

  isFlashbots?: boolean

  // cancelRequest is the txRequest object to be submitted
  // in attempt to cancel the current transaction
  // it should contain all the appropriate gas details in order
  // to get submitted first
  cancelRequest?: providers.TransactionRequest
}

export enum TransactionStatus {
  Cancelled = 'cancelled',
  Cancelling = 'cancelling',
  FailedCancel = 'failedCancel',
  Success = 'confirmed',
  Failed = 'failed',
  Pending = 'pending',
  Replacing = 'replacing',
  Unknown = 'unknown',
  // May want more granular options here later like InMemPool
}

// Transaction confirmed on chain
export type FinalizedTransactionStatus =
  | TransactionStatus.Success
  | TransactionStatus.Failed
  | TransactionStatus.Cancelled
  | TransactionStatus.FailedCancel

export interface FinalizedTransactionDetails extends TransactionDetails {
  status: FinalizedTransactionStatus
}

export interface TransactionOptions {
  request: providers.TransactionRequest
  timeoutMs?: number
}

export interface TransactionReceipt {
  transactionIndex: number
  blockHash: string
  blockNumber: number
  confirmedTime: number
  confirmations: number
}

export interface NFTSummaryInfo {
  tokenId: string
  name: string
  collectionName: string
  imageURL: string
}

export enum NFTTradeType {
  BUY = 'buy',
  SELL = 'sell',
}

/**
 * Be careful a