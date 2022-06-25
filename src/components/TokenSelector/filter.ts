import Fuse from 'fuse.js'
import { TokenOption } from 'src/components/TokenSelector/types'
import { ChainId } from 'src/constants/chains'

const searchOptions: Fuse.IFuseOptions<TokenOption> = {
  includeMatches: true,
  isCaseSensitive: false,
  keys: [
    'currencyInfo.currency.chainId',
    'currencyInfo.currency.symbol',
    'currencyInfo.currency.name',
    // prioritize other fields
    { name: 'currencyInfo.currency.address', weight: 0.2 },
  ],
  shouldSort: true,
  useExtendedSearch: true,
}

const getChainSearchPattern = (
  chain: ChainId | null
): {
  'currencyInfo.currency.chainId': string
} | null =>
  chain
    ? // exact match chain
      { 'currencyInfo.currency.chainId': `=${chain}` }
    : null

const getAddressSearchPattern = (
  addressPrefix?: string
): {
  'currencyInfo.currency.address': string
} | null =>
  addressPrefix && addressPrefix.startsWith('0x') && addressPrefix.length > 5
    ? // prefix-exact match address
      { 'currencyInfo.currency.address': `^${addressPrefix}` }
    : null

const getSymbolSearchPattern = (
  symbol?: string
): {
  'currencyInfo.currency.symbol': string
} | null =>
  symbol
    ? // include-match symbol
      { 'currencyInfo.currency.symbol': `'${symbol}` }
    : null

const getNameSearchPattern = (
  name?: string
): {
  'currencyInfo.currency.n