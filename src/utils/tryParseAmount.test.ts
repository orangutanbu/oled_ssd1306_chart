import { CurrencyAmount } from '@uniswap/sdk-core'
import JSBI from 'jsbi'
import { DAI } from 'src/constants/tokens'
import { tryParseExactAmount, tryParseRawAmount } from 'src/utils/tryParseAmount'

const ONE_DAI = CurrencyAmount.fromRawAmount(DAI, JSBI.BigInt('1000000000000000000'))
const HALF_DAI = CurrencyAmount.fromRawAmount(DAI, JSBI.BigInt('500000000000000000'))

describe(tryParseExactAmount, () => {
  it('handle undefined inputs', () => {
    expect(tryParseExactAmount(undefined, undefined)).toBeUndefined()
  })

  it('handle undefined value', () => {
    expect(tryParseRawAmount(undefined, DAI)).toBeUndefined()
  })

  it('handle undefined Currency', () => {
    expect(tryParseRawAmount('1', undefined)).toBeUndefined()
  })

  it('handle 0 typed value', () => {
    expect(tryParseExactAmount('0', DAI)).toBeNull()
  })

  it('parse standard amount', () => {
    expect(tryParseExactAmount('1', DAI)).toEqual(ONE_DAI)
  })

  it('parse decimal input', () => {
    expect(tryParseExactAmount('0.5', DAI)).toEqual(HALF_DAI)
  })

  it('handle over-precise input', () => {
    expect(tryParseExactAmount('0.00000000000000000000001', DAI)).toBeNull()
  })
})

describe(tryParse