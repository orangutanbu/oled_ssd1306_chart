import { providers as ethersProviders } from 'ethers'
import { ChainId } from 'src/constants/chains'
import { FLASHBOTS_URLS } from 'src/features/providers/constants'
import { TransactionStatus } from 'src/features/transactions/types'

export const FLASHBOTS_SUPPORTED_CHAINS = Object.keys(FLASHBOTS_URLS)
export const isFlashbotsSupportedChainI