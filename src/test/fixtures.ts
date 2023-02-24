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
  address: '0xe1d494bc8690b1ef2f0a13b6672c4f