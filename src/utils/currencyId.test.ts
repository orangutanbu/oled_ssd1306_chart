import { NATIVE_ADDRESS, NATIVE_ADDRESS_ALT } from 'src/constants/addresses'
import { ChainId } from 'src/constants/chains'
import { DAI } from 'src/constants/tokens'
import { NativeCurrency } from 'src/features/tokens/NativeCurrency'
import {
  areCurrencyIdsEqual,
  buildCurrencyId,
  buildNativeCurrencyId,
  checksumCurrencyId,
  currencyAddress,
  currencyAddressForSwapQuote,
  currencyId,
  currencyIdToAddress,
  currencyIdToChain,
  currencyIdToGraphQLAddress,
  getCurrencyAddressForAnalytics,
  getNativeCurrencyAddressForChain,
  isNativeCurrencyAddress,
  NATIVE_ANALYTICS_ADDRESS_VALUE,
  SwapRouterNativeAssets,
} from 'src/utils/currencyId'

const ETH = NativeCurrency.onChain(ChainId.Mainnet)
const MATIC = NativeCurrency.onChain(ChainId.Polygon)
const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F'

describe(currencyId, () => {
  it('builds correct ID for token', () => {
    expect(currencyId(DAI)).toEqual(`1-${DAI.address}`)
  })

  it('builds correct ID for native asset', () => {
    expect(currencyId(ETH)).toEqual(`${ChainId.Mainnet}-${NATIV