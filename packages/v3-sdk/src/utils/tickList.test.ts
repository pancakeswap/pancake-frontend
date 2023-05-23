import { describe, it, expect, beforeEach } from 'vitest'
import { Tick } from '../entities/tick'
import { TickList } from './tickList'
import { TickMath } from './tickMath'

describe('TickList', () => {
  let highTick: Tick
  let lowTick: Tick
  let midTick: Tick

  beforeEach(() => {
    lowTick = new Tick({
      index: TickMath.MIN_TICK + 1,
      liquidityNet: 10,
      liquidityGross: 10,
    })
    midTick = new Tick({
      index: 0,
      liquidityNet: -5,
      liquidityGross: 5,
    })
    highTick = new Tick({
      index: TickMath.MAX_TICK - 1,
      liquidityNet: -5,
      liquidityGross: 5,
    })
  })

  describe('#validate', () => {
    it('errors for incomplete lists', () => {
      expect(() => {
        TickList.validateList([lowTick], 1)
      }).toThrow('ZERO_NET')
    })
    it('errors for unsorted lists', () => {
      expect(() => {
        TickList.validateList([highTick, lowTick, midTick], 1)
      }).toThrow('SORTED')
    })
    it('errors if ticks are not on multiples of tick spacing', () => {
      expect(() => {
        TickList.validateList([highTick, lowTick, midTick], 1337)
      }).toThrow('TICK_SPACING')
    })
  })

  it('#isBelowSmallest', () => {
    const ticks = [lowTick, midTick, highTick]
    expect(TickList.isBelowSmallest(ticks, TickMath.MIN_TICK)).toBe(true)
    expect(TickList.isBelowSmallest(ticks, TickMath.MIN_TICK + 1)).toBe(false)
  })

  it('#isAtOrAboveLargest', () => {
    const result = [lowTick, midTick, highTick]
    expect(TickList.isAtOrAboveLargest(result, TickMath.MAX_TICK - 2)).toBe(false)
    expect(TickList.isAtOrAboveLargest(result, TickMath.MAX_TICK - 1)).toBe(true)
  })

  describe('#nextInitializedTick', () => {
    let ticks: Tick[]

    beforeEach(() => {
      ticks = [lowTick, midTick, highTick]
    })

    it('low - lte = true', () => {
      expect(() => {
        TickList.nextInitializedTick(ticks, TickMath.MIN_TICK, true)
      }).toThrow('BELOW_SMALLEST')

      expect(TickList.nextInitializedTick(ticks, TickMath.MIN_TICK + 1, true)).toEqual(lowTick)
      expect(TickList.nextInitializedTick(ticks, TickMath.MIN_TICK + 2, true)).toEqual(lowTick)
    })

    it('low - lte = false', () => {
      expect(TickList.nextInitializedTick(ticks, TickMath.MIN_TICK, false)).toEqual(lowTick)
      expect(TickList.nextInitializedTick(ticks, TickMath.MIN_TICK + 1, false)).toEqual(midTick)
    })

    it('mid - lte = true', () => {
      expect(TickList.nextInitializedTick(ticks, 0, true)).toEqual(midTick)
      expect(TickList.nextInitializedTick(ticks, 1, true)).toEqual(midTick)
    })

    it('mid - lte = false', () => {
      expect(TickList.nextInitializedTick(ticks, -1, false)).toEqual(midTick)
      expect(TickList.nextInitializedTick(ticks, 0 + 1, false)).toEqual(highTick)
    })

    it('high - lte = true', () => {
      expect(TickList.nextInitializedTick(ticks, TickMath.MAX_TICK - 1, true)).toEqual(highTick)
      expect(TickList.nextInitializedTick(ticks, TickMath.MAX_TICK, true)).toEqual(highTick)
    })

    it('high - lte = false', () => {
      expect(() => {
        TickList.nextInitializedTick(ticks, TickMath.MAX_TICK - 1, false)
      }).toThrow('AT_OR_ABOVE_LARGEST')

      expect(TickList.nextInitializedTick(ticks, TickMath.MAX_TICK - 2, false)).toEqual(highTick)
      expect(TickList.nextInitializedTick(ticks, TickMath.MAX_TICK - 3, false)).toEqual(highTick)
    })
  })

  describe('#nextInitializedTickWithinOneWord', () => {
    let ticks: Tick[]

    beforeEach(() => {
      ticks = [lowTick, midTick, highTick]
    })

    it('words around 0, lte = true', () => {
      expect(TickList.nextInitializedTickWithinOneWord(ticks, -257, true, 1)).toEqual([-512, false])
      expect(TickList.nextInitializedTickWithinOneWord(ticks, -256, true, 1)).toEqual([-256, false])
      expect(TickList.nextInitializedTickWithinOneWord(ticks, -1, true, 1)).toEqual([-256, false])
      expect(TickList.nextInitializedTickWithinOneWord(ticks, 0, true, 1)).toEqual([0, true])
      expect(TickList.nextInitializedTickWithinOneWord(ticks, 1, true, 1)).toEqual([0, true])
      expect(TickList.nextInitializedTickWithinOneWord(ticks, 255, true, 1)).toEqual([0, true])
      expect(TickList.nextInitializedTickWithinOneWord(ticks, 256, true, 1)).toEqual([256, false])
      expect(TickList.nextInitializedTickWithinOneWord(ticks, 257, true, 1)).toEqual([256, false])
    })

    it('words around 0, lte = false', () => {
      expect(TickList.nextInitializedTickWithinOneWord(ticks, -258, false, 1)).toEqual([-257, false])
      expect(TickList.nextInitializedTickWithinOneWord(ticks, -257, false, 1)).toEqual([-1, false])
      expect(TickList.nextInitializedTickWithinOneWord(ticks, -256, false, 1)).toEqual([-1, false])
      expect(TickList.nextInitializedTickWithinOneWord(ticks, -2, false, 1)).toEqual([-1, false])
      expect(TickList.nextInitializedTickWithinOneWord(ticks, -1, false, 1)).toEqual([0, true])
      expect(TickList.nextInitializedTickWithinOneWord(ticks, 0, false, 1)).toEqual([255, false])
      expect(TickList.nextInitializedTickWithinOneWord(ticks, 1, false, 1)).toEqual([255, false])
      expect(TickList.nextInitializedTickWithinOneWord(ticks, 254, false, 1)).toEqual([255, false])
      expect(TickList.nextInitializedTickWithinOneWord(ticks, 255, false, 1)).toEqual([511, false])
      expect(TickList.nextInitializedTickWithinOneWord(ticks, 256, false, 1)).toEqual([511, false])
    })

    it('performs correctly with tickSpacing > 1', () => {
      ticks = [
        new Tick({
          index: 0,
          liquidityNet: 0,
          liquidityGross: 0,
        }),
        new Tick({
          index: 511,
          liquidityNet: 0,
          liquidityGross: 0,
        }),
      ]

      expect(TickList.nextInitializedTickWithinOneWord(ticks, 0, false, 1)).toEqual([255, false])
      expect(TickList.nextInitializedTickWithinOneWord(ticks, 0, false, 2)).toEqual([510, false])
    })
  })
})
