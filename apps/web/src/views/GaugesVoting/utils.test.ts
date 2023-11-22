import { ChainId } from '@pancakeswap/chains'
import { zeroAddress } from 'viem'
import { describe, it, expect } from 'vitest'
import { getGaugeHash } from './utils'

describe('GaugesVoting/utils', async () => {
  it('getGaugeHash', async () => {
    expect(getGaugeHash(zeroAddress, ChainId.ETHEREUM)).toBe(
      '0xe99467d027c1d99b544d929e378c5ecfc6b0e521f7cc79d93719111138a166eb',
    )
  })
})
