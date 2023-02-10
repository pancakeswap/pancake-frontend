import { describe, it, expect } from 'vitest'
import { stableSwapPairsByChainId } from './getStableSwapPairs'

describe('#getStableSwapPairs', () => {
  it('stableSwapPairs', () => {
    expect(stableSwapPairsByChainId).toMatchInlineSnapshot()
  })
})
