import { ChainId } from 'src/constants/chains'
import { ActivityType } from 'src/data/__generated__/types-and-hooks'
import parseApproveTransaction from 'src/features/transactions/history/conversion/parseApproveTransaction'
import parseNFTMintTransaction from 'src/features/transactions/history/conversion/parseMintTransaction'
import parseReceiveTransaction from 'src/features/transactions/history/conversion/parseReceiveTransaction'
import parseSendTransaction from 'src/features/transactions/history/conversion/parseSendTransaction'
import parseTradeTransaction from 'src/features/transactions/history/conversion/parseTradeTransaction'
import {
  TransactionDetails,
  TransactionListQueryResponse,
  TransactionStatus,
  TransactionType,
  TransactionTypeInfo,
} from 'src/features/transactions/types'

/**
 * Parses txn API response item and identifies known txn type. Helps strictly
 * type txn summary data to be used within UI.
 *
 * @param transaction Transaction api response item to parse.
 * @returns Formatted TransactionDetails object.
 */
export defau