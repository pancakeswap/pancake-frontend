import { describe, it, expect } from 'vitest'
import { ZERO } from '../internalConstants'
import { TickLibrary } from './tickLibrary'

describe('TickLibrary', () => {
  describe('#getFeeGrowthInside', () => {
    it('0', () => {
      const [feeGrowthInside0X128, feeGrowthInside1X128] = TickLibrary.getFeeGrowthInside(
        {
          feeGrowthOutside0X128: ZERO,
          feeGrowthOutside1X128: ZERO,
        },
        {
          feeGrowthOutside0X128: ZERO,
          feeGrowthOutside1X128: ZERO,
        },
        -1,
        1,
        0,
        ZERO,
        ZERO
      )
      expect(feeGrowthInside0X128).toEqual(ZERO)
      expect(feeGrowthInside1X128).toEqual(ZERO)
    })

    it('non-0, all inside', () => {
      const [feeGrowthInside0X128, feeGrowthInside1X128] = TickLibrary.getFeeGrowthInside(
        {
          feeGrowthOutside0X128: ZERO,
          feeGrowthOutside1X128: ZERO,
        },
        {
          feeGrowthOutside0X128: ZERO,
          feeGrowthOutside1X128: ZERO,
        },
        -1,
        1,
        0,
        2n ** 128n,
        2n ** 128n
      )
      expect(feeGrowthInside0X128).toEqual(2n ** 128n)
      expect(feeGrowthInside1X128).toEqual(2n ** 128n)
    })

    it('non-0, all outside', () => {
      const [feeGrowthInside0X128, feeGrowthInside1X128] = TickLibrary.getFeeGrowthInside(
        {
          feeGrowthOutside0X128: 2n ** 128n,
          feeGrowthOutside1X128: 2n ** 128n,
        },
        {
          feeGrowthOutside0X128: ZERO,
          feeGrowthOutside1X128: ZERO,
        },
        -1,
        1,
        0,
        2n ** 128n,
        2n ** 128n
      )
      expect(feeGrowthInside0X128).toEqual(ZERO)
      expect(feeGrowthInside1X128).toEqual(ZERO)
    })

    it('non-0, some outside', () => {
      const [feeGrowthInside0X128, feeGrowthInside1X128] = TickLibrary.getFeeGrowthInside(
        {
          feeGrowthOutside0X128: 2n ** 127n,
          feeGrowthOutside1X128: 2n ** 127n,
        },
        {
          feeGrowthOutside0X128: ZERO,
          feeGrowthOutside1X128: ZERO,
        },
        -1,
        1,
        0,
        2n ** 128n,
        2n ** 128n
      )
      expect(feeGrowthInside0X128).toEqual(2n ** 127n)
      expect(feeGrowthInside1X128).toEqual(2n ** 127n)
    })
  })
})
