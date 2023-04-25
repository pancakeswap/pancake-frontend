import { CurrencyAmount, Native } from '@pancakeswap/sdk'
import { maxAmountSpend } from './maxAmountSpend'

describe('maxAmountSpend', () => {
  it('should be undefined if no input', () => {
    expect(maxAmountSpend()).toBeUndefined()
  })

  it('should has value when CurrencyAmount is BNB and CurrencyAmount is higher than min bnb', () => {
    expect(maxAmountSpend(CurrencyAmount.fromRawAmount(Native.onChain(56), 100n ** 16n)).quotient > 0n).toBeTruthy()
  })

  it('should be 0 when CurrencyAmount is BNB and CurrencyAmount is low', () => {
    expect(maxAmountSpend(CurrencyAmount.fromRawAmount(Native.onChain(56), '0')).quotient === 0n).toBeTruthy()
  })
})
