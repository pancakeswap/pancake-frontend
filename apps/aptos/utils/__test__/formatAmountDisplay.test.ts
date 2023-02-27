import { describe, it, expect } from 'vitest'

import { Fraction, JSBI } from '@pancakeswap/aptos-swap-sdk'

import formatAmountDisplay from '../formatAmountDisplay'

describe('formatAmountDisplay', () => {
  it('should show 8 decimals only', () => {
    // 0.01234567899
    const number1 = new Fraction(JSBI.BigInt(1234567899), JSBI.BigInt(100000000000))

    expect(formatAmountDisplay(number1)).toBe('0.01234567')

    // Should not show scientific number
    // 0.00000001
    const number2 = new Fraction(JSBI.BigInt(1), JSBI.BigInt(100000000))

    expect(formatAmountDisplay(number2)).toBe('0.00000001')

    // Should ignore 0 decimal
    // 0.0000000001
    const number3 = new Fraction(JSBI.BigInt(1), JSBI.BigInt(100000000000))

    expect(formatAmountDisplay(number3)).toBe('0')

    // 123456.7899
    const number4 = new Fraction(JSBI.BigInt(1234567899), JSBI.BigInt(10000))
    expect(formatAmountDisplay(number4)).toBe('123456.7899')

    // 1234567899
    const number5 = new Fraction(JSBI.BigInt(1234567899), JSBI.BigInt(1))
    expect(formatAmountDisplay(number5)).toBe('1234567899')

    // Should return empty if undefined
    expect(formatAmountDisplay(undefined)).toBe('')
  })
})
