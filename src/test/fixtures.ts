import {
  NetInfoConnectedStates,
  NetInfoNoConnectionState,
  NetInfoStateType,
  NetInfoUnknownState,
} from '@react-native-community/netinfo'
import { TradeType } from '@uniswap/sdk-core'
import { BigNumber, providers } from 'ethers'
import ERC20_ABI from 'src/abis/erc20.json'
import { Erc20, Weth } from 'src/abis/types'
import WETH_ABI from 'src/abis/weth.json'
import { config } from 'src/config'
import { NATIVE_ADDRESS, SWAP_ROUTER_ADDRESSES } from 'src/constants/addresses'
import { ChainId } from 'src/constants/chains'
import { DAI, DAI_ARBITRUM_ONE, UNI, WRAPPED_NATIVE_CURRENCY } from 'src/constants/tokens'
import { SafetyLevel } from 'src/data/__generated__/types-and-hooks'
import { AssetType } from 'src/entities/assets'
import { ContractManager } from 'src/features/contracts/ContractManager'
import { CurrencyInfo } from 'src/features/dataApi/types'
import { AppNotificationType } from 'src/features/notifications/types'
import { NativeCurrency } from 'src/features/tokens/NativeCurrency'
import { finalizeTransaction } from 'src/features/transactions/slice'
import {
  ApproveTransactionInfo,
  TransactionDetails,
  TransactionStatus,
  TransactionType,
} from 'src/features/transactions/types'
import { Account, AccountType, BackupType } from 'src/features/wallet/accounts/types'
import { SignerManager } from 'src/features/wallet/signing/SignerManager'
import { initialWalletState } from 'src/features/wallet/walletSlice'
import { WalletConnectEvent } from 'src/features/walletConnect/saga'
import { currencyId } from 'src/utils/currencyId'

export const MainnetEth = NativeCurrency.onChain(ChainId.Mainnet)

export const ACCOUNT_ADDRESS_ONE = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
export const ACCOUNT_ADDRESS_TWO = '0x1234567890123456789012345678901234567890'

export const account: Account = {
  type: AccountType.SignerMnemonic,
  address: ACCOUNT_ADDRESS_ONE,
  derivationIndex: 0,
  name: 'Test Account',
  timeImportedMs: 10,
  mnemonicId: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  backups: [BackupType.Cloud],
}

export const account2: Account = {
  type: AccountType.Readonly,
  address: '0xe1d494bc8690b1ef2f0a13b6672c4f2ee5c2d2b7',
  name: 'Test Account',
  timeImportedMs: 10,
}

const mockSigner = new (class {
  signTransaction = (): string => '0x1234567890abcdef'
  connect = (): this => this
})()

export const mockSignerManager = {
  getSignerForAccount: async (): Promise<typeof mockSigner> => mockSigner,
}

const mockFeeData = {
  maxFeePerPrice: BigNumber.from('1000'),
  maxPriorityFeePerGas: BigNumber.from('10000'),
  gasPrice: BigNumber.from('10000'),
}

export const mockProvider = {
  getBalance: (): BigNumber => BigNumber.from('1000000000000000000'),
  getGasPrice: (): BigNumber => BigNumber.from('100000000000'),
  getTransactionCount: (): number => 1000,
  estimateGas: (): BigNumber => BigNumber.from('30000'),
  sendTransaction: (): { hash: string } => ({ hash: '0xabcdef' }),
  detectNetwork: (): { name: string; chainId: ChainId } => ({ name: 'mainnet', chainId: 1 }),
  getTransactionReceipt: (): typeof txReceipt => txReceipt,
  waitForTransaction: (): typeof txReceipt => txReceipt,
  getFeeData: (): typeof mockFeeData => mockFeeData,
}

export const mockProviderManager = {
  getProvider: (): typeof mockProvider => mockProvider,
}

export const signerManager = new SignerManager()

export const provider = new providers.JsonRpcProvider()
export const providerManager = {
  getProvider: (): typeof provider => provider,
}

export const mockContractManager = {
  getOrCreateContract: (): typeof mockTokenContract => mockTokenContract,
}

export const mockTokenContract = {
  balanceOf: (): BigNumber => BigNumber.from('1000000000000000000'),
  populateTransaction: {
    transfer: (): typeof txRequest => txRequest,
    transferFrom: (): typeof txRequest => txRequest,
    safeTransferFrom: (): typeof txRequest => txRequest,
  },
}

export const contractManager = new ContractManager()
contractManager.getOrCreateContract(ChainId.Goerli, DAI.address, provider, ERC20_ABI)
contractManager.getOrCreateContract(
  ChainId.Goerli,
  WRAPPED_NATIVE_CURRENCY[ChainId.Goerli].address,
  provider,
  WETH_ABI
)
export const tokenContract = contractManager.getContract(ChainId.Goerli, DAI.address) as Erc20
export const wethContract = contractManager.getContract(
  ChainId.Goerli,
  WRAPPED_NATIVE_CURRENCY[ChainId.Goerli].address
) as Weth

/**
 * Transactions
 */
export const txRequest: providers.TransactionRequest = {
  from: '0x123',
  to: '0x456',
  value: '0x0',
  data: '0x789',
  nonce: 10,
  gasPrice: mockFeeData.gasPrice,
}

export const txReceipt = {
  transactionHash: '0x123',
  blockHash: '0x123',
  blockNumber: 1,
  transactionIndex: 1,
  confirmations: 1,
  status: 1,
}

export const txResponse = {
  hash: '0x123',
  wait: (): typeof txReceipt => txReceipt,
}

export const txTypeInfo: ApproveTransactionInfo = {
  type: TransactionType.Approve,
  tokenAddress: tokenContract.address,
  spender: SWAP_ROUTER_ADDRESSES[ChainId.Goerli],
}

export const txDetailsPending: TransactionDetails = {
  chainId: ChainId.Mainnet