import { JSBI, Price, Token, Percent } from '@pancakeswap/sdk'
import getRatePercentageDifference from './getRatePercentageDifference'

const CAKE = new Token(56, '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', 18, 'CAKE', 'PancakeSwap Token')
const BUSD = new Token(56, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18, 'BUSD', 'Binance USD')
const DOGE = new Token(56, '0xbA2aE424d960c26247Dd6c32edC70B295c744C43', 8, 'DOGE', 'Binance-Peg Dogecoin')

const EIGHTEEN_DECIMALS = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))
const FIVE = JSBI.multiply(JSBI.BigInt(5), EIGHTEEN_DECIMALS)
const TEN = JSBI.multiply(JSBI.BigInt(10), EIGHTEEN_DECIMALS)
const FIFTEEN = JSBI.multiply(JSBI.BigInt(15), EIGHTEEN_DECIMALS)

describe('limitOrders/utils/getRatePercentageDifference', () => {
  describe('18 decimal tokens', () => {
    const marketPrice = new Price(CAKE, BUSD, EIGHTEEN_DECIMALS, TEN) // 10 BUSD per 1 CAKE
    it('returns correct positive percentage', () => {
      const price = new Price(CAKE, BUSD, EIGHTEEN_DECIMALS, FIFTEEN) // 15 BUSD per 1 CAKE
      const rate = getRatePercentageDifference(marketPrice, price)
      const expectedRate = new Percent(50, 100)
      expect(expectedRate.equalTo(rate)).toBe(true)
    })
    it('returns correct negative percentage', () => {
      const price = new Price(CAKE, BUSD, EIGHTEEN_DECIMALS, FIVE) // 5 BUSD per 1 CAKE
      const rate = getRatePercentageDifference(marketPrice, price)
      const expectedRate = new Percent(-50, 100)
      expect(expectedRate.equalTo(rate)).toBe(true)
    })
    it('returns correct equal percentage', () => {
      const price = new Price(CAKE, BUSD, EIGHTEEN_DECIMALS, TEN) // 50 BUSD per 1 CAKE
      const rate = getRatePercentageDifference(marketPrice, price)
      const expectedRate = new Percent(0, 100)
      expect(expectedRate.equalTo(rate)).toBe(true)
    })
  })
  describe('18 decimal token and 8 decimal token', () => {
    const marketPrice = new Price(DOGE, BUSD, EIGHTEEN_DECIMALS, TEN) // 10 BUSD per 1 DOGE
    it('returns correct positive percentage', () => {
      const price = new Price(DOGE, BUSD, EIGHTEEN_DECIMALS, FIFTEEN) // 15 BUSD per 1 DOGE
      const rate = getRatePercentageDifference(marketPrice, price)
      const expectedRate = new Percent(50, 100)
      expect(expectedRate.equalTo(rate)).toBe(true)
    })
    it('returns correct negative percentage', () => {
      const price = new Price(DOGE, BUSD, EIGHTEEN_DECIMALS, FIVE) // 5 BUSD per 1 DOGE
      const rate = getRatePercentageDifference(marketPrice, price)
      const expectedRate = new Percent(-50, 100)
      expect(expectedRate.equalTo(rate)).toBe(true)
    })
    it('returns correct equal percentage', () => {
      const price = new Price(DOGE, BUSD, EIGHTEEN_DECIMALS, TEN) // 50 BUSD per 1 DOGE
      const rate = getRatePercentageDifference(marketPrice, price)
      const expectedRate = new Percent(0, 100)
      expect(expectedRate.equalTo(rate)).toBe(true)
    })
  })
  describe('gracefully handles undefined arguments', () => {
    it('with undefined market price', () => {
      const price = new Price(DOGE, BUSD, EIGHTEEN_DECIMALS, FIFTEEN) // 15 BUSD per 1 DOGE
      const rate = getRatePercentageDifference(undefined, price)
      expect(rate).toBeUndefined()
    })
    it('with undefined price', () => {
      const marketPrice = new Price(DOGE, BUSD, EIGHTEEN_DECIMALS, TEN) // 10 BUSD per 1 DOGE
      const rate = getRatePercentageDifference(marketPrice, undefined)
      expect(rate).toBeUndefined()
    })
    it('with both prices undefined', () => {
      const rate = getRatePercentageDifference(undefined, undefined)
      expect(rate).toBeUndefined()
    })
  })
})
