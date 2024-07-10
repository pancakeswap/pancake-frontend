import { describe, expect, it } from 'vitest'
import { Currency, CurrencyAmount, NativeCurrency, Token, getTokenComparator, sortCurrencies } from '../src'

describe('Utils', () => {
  const ADDRESS_ONE = '0x0000000000000000000000000000000000000001'
  const ADDRESS_TWO = '0x0000000000000000000000000000000000000002'
  const ADDRESS_THREE = '0x0000000000000000000000000000000000000003'
  const ADDRESS_FOUR = '0x0000000000000000000000000000000000000004'

  describe('#order', () => {
    it('order tokens correctly', () => {
      const tokenA = new Token(56, ADDRESS_ONE, 18, 'A')
      const tokenB = new Token(56, ADDRESS_TWO, 18, 'B')
      const tokenC = new Token(56, ADDRESS_THREE, 18, 'C')
      const tokenD = new Token(56, ADDRESS_FOUR, 18, 'D')

      const tokenComparator = getTokenComparator({
        [tokenA.address]: CurrencyAmount.fromRawAmount(tokenA, 4),
        [tokenB.address]: CurrencyAmount.fromRawAmount(tokenB, 2),
        [tokenC.address]: CurrencyAmount.fromRawAmount(tokenC, 5),
        [tokenD.address]: CurrencyAmount.fromRawAmount(tokenD, 8),
      })

      const unSortedTokens = [tokenB, tokenA, tokenC, tokenD]
      unSortedTokens.sort(tokenComparator)
      expect(unSortedTokens[0].equals(tokenD)).toBe(true)
      expect(unSortedTokens[1].equals(tokenC)).toBe(true)
      expect(unSortedTokens[2].equals(tokenA)).toBe(true)
      expect(unSortedTokens[3].equals(tokenB)).toBe(true)
    })
  })

  describe('#sortCurrencies', () => {
    const tokenA = new Token(56, ADDRESS_ONE, 18, 'A')
    const tokenB = new Token(56, ADDRESS_TWO, 18, 'B')
    class Ether extends NativeCurrency {
      // eslint-disable-next-line class-methods-use-this
      public equals(_other: Currency): boolean {
        throw new Error('Method not implemented.')
      }

      // eslint-disable-next-line class-methods-use-this
      public get wrapped(): Token {
        throw new Error('Method not implemented.')
      }

      public constructor() {
        super(1, 18, 'ETH')
      }
    }
    const ether = new Ether()
    it('sorts by native currency first', () => {
      const currencies = [ether, tokenA]
      expect(sortCurrencies(currencies)).toEqual([ether, tokenA])
    })
    it('sorts by token address', () => {
      const currencies = [tokenB, tokenA]
      expect(sortCurrencies(currencies)).toEqual([tokenA, tokenB])
    })
  })
})
