import { describe, expect, it } from 'vitest'

import BigNumber from 'bignumber.js'
import { getFullDisplayBalance } from '../formatBalance'

describe('getFullDisplayBalance', () => {
  it('should return balance with trim 0', () => {
    const decimal = 8

    expect(getFullDisplayBalance(new BigNumber('1000000000'), decimal, decimal)).toBe('10')
    expect(getFullDisplayBalance(new BigNumber('1000000000'), decimal)).toBe('10')
    expect(getFullDisplayBalance(new BigNumber('10000000202'), decimal, decimal)).toBe('100.00000202')
    expect(getFullDisplayBalance(new BigNumber('10000'), decimal, decimal)).toBe('0.0001')
  })
})
