// adapted from https://github.com/Uniswap/interface/src/constants/tokens.ts
import { Currency, NativeCurrency as NativeCurrencyClass, Token } from '@uniswap/sdk-core'
import { NATIVE_ADDRESS, NATIVE_ADDRESS_ALT } from 'src/constants/addresses'
import { ChainId, CHAIN_INFO, isPolygonChain } from 'src/constants/chains'
import { WRAPPED_NATIVE_CURRENCY } from 'src/constants/tokens'

export class NativeCurrency implements NativeCurrencyClass {
  constructor(chainId: number) {
    const chainInfo = CHAIN_INFO[chainId]
    if (!chainInfo) throw new Error('Native currrency info not found')

    this.chainId = chainId
    this.decimals = chainInfo.nativeCurrency.decimals
    this.name = chainInfo.nativeCurrency.name
    this.symbol = chainInfo.nativeCurrency.symbol
    this.isNative = true
    this.isToken = false
  }

  chainId: number
  decimals: number
  name: string
  symbol: string
  isNative: true
  isToken: false

  address = NATIVE_ADDRESS

  equals(currency: Currency): boolean {
    return currency.isNative && currency.chainId === this.chainId
  }

  public get wrapped(): Token {
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId as C