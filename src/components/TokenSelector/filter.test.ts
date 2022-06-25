import { Currency } from '@uniswap/sdk-core'
import { filter } from 'src/components/TokenSelector/filter'
import { TokenOption } from 'src/components/TokenSelector/types'
import { ChainId } from 'src/constants/chains'
import { DAI, DAI_ARBITRUM_ONE } from 'src/constants/tokens'
import { NativeCurrency } from 'src/features/tokens/NativeCurrency'
import { currencyId } from 'src/utils/currencyId'

const ETH = NativeCurrency.onChain(ChainId.Mainnet)

const TEST_TOKEN_INPUT: TokenOption[] = [
  {
    currencyInfo: {
      currency: DAI,
      currencyId: currencyId(DAI),
      logoUrl: null,
      safetyLevel: null,
    },
    balanceUSD: null,
    quantity: null,
  },
  {
    currencyInfo: {
      currency: ETH,
      currencyId: currencyId(ETH),
      logoUrl: null,
      safetyLevel: null,
    },
    balanceUSD: null,
    quantity: null,
  },
  {
    currencyInfo: {
      currency: DAI_ARBITRUM_ONE,
      currencyId: currencyId(DAI_ARBITRUM_ONE),
      logoUrl: null,
      safetyLevel: null,
    },
    balanceUSD: null,
    quantity: null,
  },
]

const filterAndGetCurrencies = (
  currencies: TokenOption[],
  chainFilter: ChainId | null,
  searchFilter?: string
): Currency[] => filter(currencies, chainFilter, searchFilter).map((cm) => cm.currencyInfo.currency)

describe(filter, () => {
  it('returns the entire input flattened if chainFilter and searchFilter are null', () => {
    expect(filterAndGetCurrencies(TEST_TOKEN_INPUT, null)).toEqual([DAI, ETH, DAI_ARBITRUM_ONE])
    expect(filterAndGetCurrencies(TEST_TOKEN_INPUT, null, '')).toEqual([DAI, ETH, DAI_ARBITRUM_ONE])
  })

  it('filters by single chain', () => {
    expect(filterAndGetCurrencies(TEST_TOKEN_INPUT, ChainId.Mainnet)).toEqual([DAI, ETH])
  })

  it('filters by partial token symbol', () => {
    expect(filterAndGetCurrencies(TEST_TOKEN_INPUT, null, 'D')).toEqual([DAI, DAI_ARBITRUM_ONE])
    expect(filterAndGetCurrencies(TEST_TOKEN_INPUT, null, 'DA')).toEqual([DAI, DAI_ARBITRUM_ONE])
    expect(filterAndGetCurrencies(TEST_TOKEN_INPUT, null, 'DAI')).toEqual([DAI, DAI_ARBITRUM_ONE])
    expect(filterAndGetCurrencies(TEST_TOKEN_INPUT, null, 'ETH')).toEqual([ETH])
  })

  it('filters by partial token name', () => {
    expect(filterAnd