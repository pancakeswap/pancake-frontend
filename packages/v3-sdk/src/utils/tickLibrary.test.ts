import JSBI from 'jsbi'
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
        JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128)),
        JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128))
      )
      expect(feeGrowthInside0X128).toEqual(JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128)))
      expect(feeGrowthInside1X128).toEqual(JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128)))
    })

    it('non-0, all outside', () => {
      const [feeGrowthInside0X128, feeGrowthInside1X128] = TickLibrary.getFeeGrowthInside(
        {
          feeGrowthOutside0X128: JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128)),
          feeGrowthOutside1X128: JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128)),
        },
        {
          feeGrowthOutside0X128: ZERO,
          feeGrowthOutside1X128: ZERO,
        },
        -1,
        1,
        0,
        JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128)),
        JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128))
      )
      expect(feeGrowthInside0X128).toEqual(ZERO)
      expect(feeGrowthInside1X128).toEqual(ZERO)
    })

    it('non-0, some outside', () => {
      const [feeGrowthInside0X128, feeGrowthInside1X128] = TickLibrary.getFeeGrowthInside(
        {
          feeGrowthOutside0X128: JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(127)),
          feeGrowthOutside1X128: JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(127)),
        },
        {
          feeGrowthOutside0X128: ZERO,
          feeGrowthOutside1X128: ZERO,
        },
        -1,
        1,
        0,
        JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128)),
        JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128))
      )
      expect(feeGrowthInside0X128).toEqual(JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(127)))
      expect(feeGrowthInside1X128).toEqual(JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(127)))
    })
  })
})
