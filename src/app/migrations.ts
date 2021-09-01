// Type information currently gets lost after a migration
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import dayjs from 'dayjs'
import { ChainId } from 'src/constants/chains'
import { ChainsState } from 'src/features/chains/chainsSlice'
import { ensApi } from 'src/features/ens/api'
import { ModalName } from 'src/features/telemetry/constants'
import { TransactionState } from 'src/features/transactions/slice'
import {
  ChainIdToTxIdToDetails,
  TransactionStatus,
  TransactionType,
} from 'src/features/transactions/types'
import { Account, AccountType } from 'src/features/wallet/accounts/types'
import { DEMO_ACCOUNT_ADDRESS } from 'src/features/wallet/accounts/useTestAccount'
import { toSupportedChainId } from 'src/utils/chainId'

export const migrations = {
  0: (state: any) => {
    const oldTransactionState = state?.transactions
    const newTransactionState: any = {}

    const chainIds = Object.keys(oldTransactionState?.byChainId ?? {})
    for (const chainId of chainIds) {
      const transactions = oldTransactionState.byChainId?.[chainId] ?? []
      const txIds = Object.keys(transactions)
      for (const txId of txIds) {
        const txDetails = transactions[txId]
        const address = txDetails.from
        newTransactionState[address] ??= {}
        newTransactionState[address][chainId] ??= {}
        newTransactionState[address][chainId][txId] = { ...txDetails }
      }
    }

    const oldNotificationState = state.notifications
    const newNotificationState = { ...oldNotificationState, lastTxNotificationUpdate: {} }
    const addresses = Object.keys(oldTransactionState?.lastTxHistoryUpdate || [])
    for (const address of addresses) {
      newNotificationState.lastTxNotificationUpdate[address] = {
        [ChainId.Mainnet]: oldTransactionState.lastTxHistoryUpdate[address],
      }
    }

    return { ...state, transactions: newTransactionState, notifications: newNotificationState }
  },

  1: (state: any) => {
    const newState = { ...state }
    delete newState.walletConnect?.modalState
    return newState
  },

  2: (state: any) => {
    const newState = { ...state }
    const oldFollowingAddresses = state?.favorites?.followedAddresses
    if (oldFollowingAddresses) newState.favorites.watchedAddresses = oldFollowingAddresses
    delete newState?.favorites?.followedAddresses
    return newState
  },

  3: (state: any) => {
    const newState = { ...state }
    newState.searchHistory = { results: [] }
    return newState
  },

  4: (state: any) => {
    const newState = { ...state }
    const accounts = newState?.wallet?.accounts ?? {}
    let derivationIndex = 0
    for (const account of Object.keys(accounts)) {
      newState.wallet.accounts[account].timeImportedMs = dayjs().valueOf()
      if (newState.wallet.accounts[account].type === 'native') {
        newState.wallet.accounts[account].derivationIndex = derivationIndex
        derivationIndex += 1
      }
    }
    return newState
  },

  5: (state: any) => {
    const newState = { ...state }
    newState.modals = {
      [ModalName.WalletConnectScan]: {
        isOpen: false,
        initialState: 0,
      },
      [ModalName.Swap]: {
        isOpen: false,
        initialState: undefined,
      },
      [ModalName.Send]: {
        isOpen: false,
        initialState: undefined,
      },
    }

    delete newState?.balances
    return newState
  },

  6: (state: any) => {
    const newState = { ...state }
    newState.walletConnect = { ...newState.walletConnect, pendingSession: null }
    newState.wallet = { ...newState.wallet, settings: {} }

    delete newState?.wallet?.bluetooth
    return newState
  },

  7: (state: any) => {
    const newState = { ...state }
    const accounts = newState?.wallet?.accounts ?? {}
    const originalAccountValues = Object.keys(accounts)
    for (const account of originalAccountValues) {
      if (accounts[account].type === 'native' && accounts[account].derivationIndex !== 0) {
        delete accounts[account]
      } else if (accounts[account].type === 'native' && accounts[account].derivationIndex === 0) {
        accounts[account].mnemonicId = accounts[account].address
      }
    }
    return newState
  },

  8: (state: any) => {
    const newState = { ...state }
    newState.cloudBackup = { backupsFound: [] }
    return newState
  },

  9: (state: any) => {
    const newState = { ...state }
    const accounts = newState?.wallet?.accounts ?? {}
    for (const account of Object.keys(accounts)) {
      if (newState.wallet.accounts[account].type === 'local') {
        delete newState.wallet.accounts[account]
      }
    }
    return newState
  },

  10: (state: any) => {
    const newState = { ...state }
    const accounts = newState?.wallet?.accounts ?? {}

    if (accounts[DEMO_ACCOUNT_ADDRESS]) {
      delete accounts[DEMO_ACCOUNT_ADDRESS]
    }

    return newState
  },

  11: (state: any) => {
    const newState = { ...state }
    newState.biometricSettings = {
      requiredForAppAccess: false,
      requiredForTransactions: false,
    }

    return newState
  },

  12: (state: any) => {
    const accounts: Record<Address, Account> | undefined = state?.wallet?.accounts
    const newAccounts = Object.values(accounts ?? {}).map((account: Account) => {
      const newAccount = { ...account }
      newAccount.pushNotificationsEnabled = false
      return newAccount
    })

    const newAccountObj = newAccounts.reduce<Record<Address, Account>>((accountObj, account) => {
      accountObj[account.address] = account
      return accountObj
    }, {})

    const newState = { ...state }
    newState.wallet = { ...state.wallet, accounts: newAccountObj }
    return newState
  },

  13: (state: any) => {
    const newState = { ...state }
    newState.ens = { ensForAddress: {} }
    return newState
  },

  14: (state: any) => {
    const newState = { ...state }
    newState.biometricSettings = {
      requiredForAppAccess: state.wallet.isBiometricAuthEnabled,
      requiredForTransactions: state.wallet.isBiometricAuthEnabled,
    }
    delete newState.wallet?.isBiometricAuthEnabled
    return newState
  },

  15: (state: any) => {
    const newState = { ...state }
    const accounts = newState?.wallet?.accounts ?? {}
    for (const account of Object.keys(accounts)) {
      if (newState.wallet.accounts[account].type === 'native') {
        newState.wallet.accounts[account].type = AccountType.SignerMnemonic
      }
    }
    return newState
  },

  16: (state: any) => {
    const newState = { ...state }
    delete newState.dataApi
    return newState
  },

  17: (state: any) => {
    const accounts: Record<Address, Account> | undefined = state?.wallet?.accounts
    if (!accounts) return

    for (const account of Object.values(accounts)) {
      account.pushNotificationsEnabled = false
    }

    const newState = { ...state }
    newState.wallet = { ...state.wallet, accounts }
    return newState
  },

  18: (state: any) => {
    const newState = { ...state }
    delete newState.ens
    return newState
  },

  19: (state: any) => {
    const newState = { ...state }

    const chainState: ChainsState | undefined = newState?.chains
    const newChainState = Object.keys(chainState?.byChainId ?? {}).reduce<ChainsState>(
      (tempState, chainIdString) => {
        const chainId = toSupportedChainId(chainIdString)
        if (!chainId) return tempState

        const chainInfo = chainState?.byChainId[chainId]
        if (!chainInfo) return tempState

        tempState.byChainId[chainId] = chainInfo
        return tempState
      },
      { byChainId: {} }
    )

    const blockState: any | undefined = newState?.blocks
    const newBlockState = Object.keys(blockState?.byChainId ?? {}).reduce<any>(
      (tempState, chainIdString) => {
        const chainId = toSupportedChainId(chainIdString)
        if (!chainId) return tempState

        const blockInfo = blockState?.byChainId[chainId]
        if (!blockInfo) return tempState

        tempState.byChainId[chainId] = blockInfo
        return tempState
      },
      { byChainId: {} }
    )

    const transactionState: TransactionState | undefined = newState?.transactions
    const newTransactionState = Object.keys(transactionState ?? {}).reduce<TransactionState>(
      (tempState, address) => {
        const txs = transactionState?.[address]
        if (!txs) return tempState

        const newAddressTxState = Object.keys(txs).reduce<ChainIdToTxIdToDetails>(
          (tempAddressState, chainIdString) => {
            const chainId = toSupportedChainId(chainIdString)
            if (!chainId) return tempAddressState

            const txInfo = txs[chainId]
            if (!txInfo) return tempAddressState

            tempAddressState[chainId] = txInfo
            return tempAddressState
          },
          {}
        )

        tempState[address] = newAddressTxState
        return tempState
      },
      {}
    )

    return {
      ...newState,
      chains: newChainState,
      blocks: newBlockState,
      transactions: newTransactionState,
    }
  },

  20: (state: any) => {
    const newState = { ...state }
    newState.notificat