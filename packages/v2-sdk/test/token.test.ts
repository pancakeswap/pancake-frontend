import { ChainId } from '@pancakeswap/chains'
import { Token } from '@pancakeswap/swap-sdk-core'
import { describe, expect, it } from 'vitest'

describe('Token', () => {
  const ADDRESS_ONE = '0x0000000000000000000000000000000000000001'
  const ADDRESS_TWO = '0x0000000000000000000000000000000000000002'

  describe('#equals', () => {
    it('fails if address differs', () => {
      expect(new Token(ChainId.BSC, ADDRESS_ONE, 18, 'A').equals(new Token(ChainId.BSC, ADDRESS_TWO, 18, 'B'))).toBe(
        false,
      )
    })

    it('false if chain id differs', () => {
      expect(
        new Token(ChainId.BSC_TESTNET, ADDRESS_ONE, 18, 'A').equals(new Token(ChainId.BSC, ADDRESS_ONE, 18, 'B')),
      ).toBe(false)
    })

    it('true if only decimals differs', () => {
      expect(new Token(ChainId.BSC, ADDRESS_ONE, 9, 'A').equals(new Token(ChainId.BSC, ADDRESS_ONE, 18, 'B'))).toBe(
        true,
      )
    })

    it('true if address is the same', () => {
      expect(new Token(ChainId.BSC, ADDRESS_ONE, 18, 'A').equals(new Token(ChainId.BSC, ADDRESS_ONE, 18, 'B'))).toBe(
        true,
      )
    })

    it('true on reference equality', () => {
      const token = new Token(ChainId.BSC, ADDRESS_ONE, 18, 'A')
      expect(token.equals(token)).toBe(true)
    })

    it('true even if name/symbol/decimals/projectLink differ', () => {
      const tokenA = new Token(ChainId.BSC, ADDRESS_ONE, 9, 'abc', 'def', 'https://www.binance.org/')
      const tokenB = new Token(ChainId.BSC, ADDRESS_ONE, 18, 'ghi', 'jkl', 'https://coinmarketcap.com/')
      expect(tokenA.equals(tokenB)).toBe(true)
    })
  })
})
