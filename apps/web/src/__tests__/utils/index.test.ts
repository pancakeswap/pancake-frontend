import { Token, ChainId, Percent, CurrencyAmount } from '@pancakeswap/sdk'
import { getBlockExploreLink, isAddress, calculateGasMargin } from 'utils'
import { calculateSlippageAmount, basisPointsToPercent } from 'utils/exchange'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'

describe('utils', () => {
  describe('#getBscScanLink', () => {
    it('correct for tx', () => {
      expect(getBlockExploreLink('abc', 'transaction', ChainId.BSC)).toEqual('https://bscscan.com/tx/abc')
    })
    it('correct for token', () => {
      expect(getBlockExploreLink('abc', 'token', ChainId.BSC)).toEqual('https://bscscan.com/token/abc')
    })
    it('correct for address', () => {
      expect(getBlockExploreLink('abc', 'address', ChainId.BSC)).toEqual('https://bscscan.com/address/abc')
    })
    it('enum', () => {
      expect(getBlockExploreLink('abc', 'address', ChainId.BSC_TESTNET)).toEqual(
        'https://testnet.bscscan.com/address/abc',
      )
    })
  })

  describe('#calculateSlippageAmount', () => {
    it('bounds are correct', () => {
      const tokenAmount = CurrencyAmount.fromRawAmount(new Token(ChainId.BSC, ADDRESS_ZERO, 0), '100')
      expect(() => calculateSlippageAmount(tokenAmount, -1)).toThrow()
      expect(calculateSlippageAmount(tokenAmount, 0).map((bound) => bound.toString())).toEqual(['100', '100'])
      expect(calculateSlippageAmount(tokenAmount, 100).map((bound) => bound.toString())).toEqual(['99', '101'])
      expect(calculateSlippageAmount(tokenAmount, 200).map((bound) => bound.toString())).toEqual(['98', '102'])
      expect(calculateSlippageAmount(tokenAmount, 10000).map((bound) => bound.toString())).toEqual(['0', '200'])
      expect(() => calculateSlippageAmount(tokenAmount, 10001)).toThrow()
    })
  })

  describe('#isAddress', () => {
    it('returns false if not', () => {
      expect(isAddress('')).toBe(false)
      expect(isAddress('0x0000')).toBe(false)
      expect(isAddress(1)).toBe(false)
      expect(isAddress({})).toBe(false)
      expect(isAddress(undefined)).toBe(false)
    })

    it('returns the checksummed address', () => {
      expect(isAddress('0xf164fc0ec4e93095b804a4795bbe1e041497b92a')).toBe('0xf164fC0Ec4E93095b804a4795bBe1e041497b92a')
      expect(isAddress('0xf164fC0Ec4E93095b804a4795bBe1e041497b92a')).toBe('0xf164fC0Ec4E93095b804a4795bBe1e041497b92a')
    })

    it('succeeds even without prefix', () => {
      expect(isAddress('f164fc0ec4e93095b804a4795bbe1e041497b92a')).toBe('0xf164fC0Ec4E93095b804a4795bBe1e041497b92a')
    })
    it('fails if too long', () => {
      expect(isAddress('f164fc0ec4e93095b804a4795bbe1e041497b92a0')).toBe(false)
    })
  })

  describe('#calculateGasMargin', () => {
    it('adds 10%', () => {
      expect(calculateGasMargin(1000n).toString()).toEqual('1100')
      expect(calculateGasMargin(50n).toString()).toEqual('55')
    })
  })

  describe('#basisPointsToPercent', () => {
    it('converts basis points numbers to percents', () => {
      expect(basisPointsToPercent(100).equalTo(new Percent(1n, 100n))).toBeTruthy()
      expect(basisPointsToPercent(500).equalTo(new Percent(5n, 100n))).toBeTruthy()
      expect(basisPointsToPercent(50).equalTo(new Percent(5n, 1000n))).toBeTruthy()
    })
  })
})
