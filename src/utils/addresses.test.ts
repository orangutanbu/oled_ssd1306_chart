import { getValidAddress } from 'src/utils/addresses'

it('returns lower case address for valid address', () => {
  const validAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'

  expect(getValidAddress(validAddress)).toBe(validAddress.toLowerCase())
})

it('returns null for address with wrong len