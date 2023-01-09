import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Ether } from '@uniswap/sdk-core'
import { ChainId } from 'src/constants/chains'
import { WBTC } from 'src/constants/tokens'
import { CurrencyId, currencyId as idFromCurrency } from 'src/utils/currencyId'
import { logger } from 'src/utils/logger'

export interface FavoritesState {
  tokens: CurrencyId[]
  watchedAddresses: Address[]
  // add other types of assets here, e.g. nfts
}

// Default currency ids, need to be in lowercase to match slice add and remove behavior
const WBTC_CURRENCY_ID = idFromCurrency(WBTC).toLowerCase()
const ETH_CURRENCY_ID = idFromCurrency(Ether.onChain(ChainId.Mainnet)).toLowerCase()

const VITALIK_ETH_ADDRESS = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
const HAYDEN_ETH_ADDRESS = '0x50EC05ADe8280758E2077fcBC08D878D4aef79C3'

export const initialFavoritesState: FavoritesState = {
  tokens: [ETH_CURRENCY_ID, WBTC_CURRENCY_ID],
  watchedAddresses: [VITALIK_ETH_ADDRESS, HAYDEN_ETH_ADDRESS],
}

export const slice = createSlice({
  name: 'favorites',
  initialState: initialFavoritesState,
  reducers: {
    addFavoriteToken: (
      state,
      { payload: { currencyId } }: PayloadAction<{ currencyId: string }>
