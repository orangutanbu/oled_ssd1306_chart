// Copied from https://github.com/Uniswap/interface/blob/main/src/utils/parseENSAddress.test.ts

import { parseENSAddress } from './parseENSAddress'

describe('parseENSAddress', () => {
  it('test cases', () => {
    expect(parseENSAddress('hello.eth')).toEqual({ ensName: 'hello.eth', ensPath: undefined })
    expect(parseENSAddress('hello.eth/')).toEqual({ ensName: 'hello.eth', ensPath: '/' })
    expect(parseENSAddress('hello.world.eth/')).toEqual({
      ensName: 'hello.world.eth',
      ensPath: '/',
    })
    expect(parseENSAddress('hello.world.eth/abcdef')).toEqual({
      ensName: 'hello.world.eth',
      ensPath: '/abcdef',
    })
    expect(parseENSAddress('abso.lutely')).toEqual(undefined)
    expect(parseENSAddress('abso.lutely.eth')).toEqual({