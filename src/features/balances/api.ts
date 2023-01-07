import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Currency, CurrencyAmount, NativeCurrency as NativeCurrencyClass } from '@uniswap/sdk-core'
import { useMemo } from 'react'
import ERC20_ABI from 'src/abis/erc20.json'
import { walletContextValue } from 'src/app/walletContext'
import { ChainId } from 'src/constants/chains'
import { NativeCurrency } from 'src/features/tokens/NativeCurrency'
import { getPollingIntervalByBlocktime } from 'src/utils/chainId'
import { buildCurrencyId, currencyAddress as getCurrencyAddress } from 'src/utils/currencyId'
import { logger } from 'src/utils/logger'

const BALANCES_REDUCER_NAME = 'onchain-balances'

export type BalanceLookupParams = {
  currencyAddress?: Address
  chainId?: ChainId
  currencyIsNative?: boolean
  accountAddress?: string
}

export const onChainBalanceApi = createApi({
  reducerPath: BALANCES_REDUCER_NAME,
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    balance: builder.query<string | undefined, BalanceLookupParams>({
      queryFn: async (params: BalanceLookupParams) => {
        const { currencyAddress, chainId, currencyIsNative, accountAddress } = params
        try {
          if (!currencyAddress || !chainId || !accountAddress)
            return {
              error: {
                status: 400,
                data: `currencyAddress, chainId, or accountAddress is not defined`,
              },
            }

          const provider = walletContextValue.providers.getProvider(chainId)

          // native amount lookup
          if (currencyIsNative) {
            const nativeBalance = await provider.getBalance(accountAddress)
            return { data: nativeBalance?.toString() }
          }

          // erc20 lookup
          const erc20Contract = walletContextValue.contracts.getOrCreateContract(
            chainId,
            currencyAddress,
            provider,
            ERC20_ABI
          )
          const balance = await erc20Contract.callStatic.balanceOf?.(accountAddress)
          return { data: balance.toString() }
        } catch (e: unknown) {
          logger.error(
            'balances/api',
            'balance',
            `Unable to get balance for currency: ${
              chainId && currencyAddress ? buildCurrencyId(chainId, currencyAddress) : undefined
            }`,
            e
          )
          return { error: { status