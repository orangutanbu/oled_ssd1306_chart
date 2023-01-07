/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Contract, ContractInterface, providers } from 'ethers'
import { ChainId } from 'src/constants/chains'
import { getValidAddress } from 'src/utils/addresses'
import { isNativeCurrencyAddress } from 'src/utils/currencyId'
import { logger } from 'src/utils/logger'

export class ContractManager {
  private _contracts: Partial<Record<ChainId, Record<string, Contract>>> = {}

  createContract(
    chainId: ChainId,
    address: Address,
    provider: providers.Provider,
    ABI: ContractInterface
  ): Contract {
    if (isNativeCurrencyAddress(chainId, address) || !getValidAddress(address