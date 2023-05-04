import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { describe, it, expect } from 'vitest'
import { ONE } from '../internalConstants'
import { mostSignificantBit } from './mostSignificantBit'

describe('mostSignificantBit', () => {
  it('throws for zero', () => {
    expect(() => mostSignificantBit(0n)).toThrow('ZERO')
  })
  it('correct value for every power of 2', () => {
    for (let i = 1; i < 256; i++) {
      const x = 2n ** BigInt(i)
      expect(mostSignificantBit(x)).toEqual(i)
    }
  })
  it('correct value for every power of 2 - 1', () => {
    for (let i = 2; i < 256; i++) {
      const x = 2n ** BigInt(i) - 1n
      expect(mostSignificantBit(x)).toEqual(i - 1)
    }
  })

  it('succeeds for MaxUint256', () => {
    expect(mostSignificantBit(MaxUint256)).toEqual(255)
  })

  it('throws for MaxUint256 + 1', () => {
    expect(() => mostSignificantBit(MaxUint256 + ONE)).toThrow('MAX')
  })
})
