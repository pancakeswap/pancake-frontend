import { TickMath } from '../utils/tickMath'
import { Tick } from './tick'

describe('Tick', () => {
  describe('constructor', () => {
    it('throws if tick is below min tick', () => {
      expect(() => new Tick({ index: TickMath.MIN_TICK - 1, liquidityGross: 0, liquidityNet: 0 })).toThrow('TICK')
    })

    it('throws if tick is above max tick', () => {
      expect(() => new Tick({ index: TickMath.MAX_TICK + 1, liquidityGross: 0, liquidityNet: 0 })).toThrow('TICK')
    })
  })
})
