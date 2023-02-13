
import { providers } from 'ethers'
import { useCallback } from 'react'
import ERC1155_ABI from 'src/abis/erc1155.json'
import ERC20_ABI from 'src/abis/erc20.json'
import ERC721_ABI from 'src/abis/erc721.json'
import { Erc1155, Erc20, Erc721 } from 'src/abis/types'
import { useContractManager, useProvider } from 'src/app/walletContext'
import { ChainId } from 'src/constants/chains'
import { AssetType, NFTAssetType } from 'src/entities/assets'
import { ContractManager } from 'src/features/contracts/ContractManager'
import { CurrencyField } from 'src/features/transactions/transactionState/transactionState'
import { DerivedTransferInfo } from 'src/features/transactions/transfer/hooks'
import { Account } from 'src/features/wallet/accounts/types'
import { useActiveAccountWithThrow } from 'src/features/wallet/hooks'
import { toSupportedChainId } from 'src/utils/chainId'
import { currencyAddress, isNativeCurrencyAddress } from 'src/utils/currencyId'
import { useAsyncData } from 'src/utils/hooks'

export interface BaseTransferParams {
  type: AssetType
  txId?: string
  account: Account
  chainId: ChainId
  toAddress: Address
  tokenAddress: Address
}

export interface TransferCurrencyParams extends BaseTransferParams {
  type: AssetType.Currency
  amountInWei: string
}

export interface TransferNFTParams extends BaseTransferParams {
  type: NFTAssetType
  tokenId: string
}

export type TransferTokenParams = TransferCurrencyParams | TransferNFTParams

export function useTransferTransactionRequest(
  derivedTransferInfo: DerivedTransferInfo
): providers.TransactionRequest | undefined {
  const account = useActiveAccountWithThrow()
  const chainId = toSupportedChainId(derivedTransferInfo.chainId)
  const provider = useProvider(chainId ?? ChainId.Mainnet)
  const contractManager = useContractManager()

  const transactionFetcher = useCallback(() => {
    if (!provider) return

    return getTransferTransaction(provider, contractManager, account, derivedTransferInfo)
  }, [account, contractManager, derivedTransferInfo, provider])

  return useAsyncData(transactionFetcher).data
}

async function getTransferTransaction(
  provider: providers.Provider,
  contractManager: ContractManager,
  account: Account,
  derivedTransferInfo: DerivedTransferInfo
): Promise<providers.TransactionRequest | undefined> {
  const params = getTransferParams(account, derivedTransferInfo)
  if (!params) return

  const { type, tokenAddress, chainId } = params
  switch (type) {
    case AssetType.ERC1155:
      return getErc1155TransferRequest(params, provider, contractManager)
    case AssetType.ERC721:
      return getErc721TransferRequest(params, provider, contractManager)