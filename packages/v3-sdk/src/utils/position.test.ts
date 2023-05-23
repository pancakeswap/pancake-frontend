import { describe, it, expect } from 'vitest'
import { PositionLibrary } from '.'
import { ZERO } from '../internalConstants'

describe('PositionLibrary', () => {
  describe('#getTokensOwed', () => {
    it('0', () => {
      const [tokensOwed0, tokensOwed1] = PositionLibrary.getTokensOwed(ZERO, ZERO, ZERO, ZERO, ZERO)
      expect(tokensOwed0).toEqual(ZERO)
      expect(tokensOwed1).toEqual(ZERO)
    })

    it('non-0', () => {
      const [tokensOwed0, tokensOwed1] = PositionLibrary.getTokensOwed(ZERO, ZERO, 1n, 2n ** 128n, 2n ** 128n)
      expect(tokensOwed0).toEqual(1n)
      expect(tokensOwed1).toEqual(1n)
    })
  })
})
