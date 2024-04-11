import { describe, expect, test } from 'vitest'
import { TEN_PERCENT_FEE } from '../../constants/fee'
import { getFeeAmount } from './getFeeAmount'

describe('getFeeAmount', () => {
  const amount = 100n

  test('feeBips = 0', () => {
    const feeBips = 0n
    const fee = feeBips * BigInt(1e12)
    const denominator = BigInt(1e18) - fee
    const expectedFeeAmount = (amount * fee + denominator - 1n) / denominator

    expect(getFeeAmount(amount, feeBips)).toBe(expectedFeeAmount)
  })

  test('feeBips = MAX', () => {
    const feeBips = TEN_PERCENT_FEE
    const fee = feeBips * BigInt(1e12)
    const denominator = BigInt(1e18) - fee
    const expectedFeeAmount = (amount * fee + denominator - 1n) / denominator
    expect(getFeeAmount(amount, feeBips)).toBe(expectedFeeAmount)
  })
})
