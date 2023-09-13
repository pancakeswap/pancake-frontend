import { describe, expect, it } from 'vitest'
import * as Chains from '../src/chains'
import { ChainId } from '../src'

describe('chains', () => {
  it('should match all ChainId defined', () => {
    const ids = Object.values(ChainId).filter((n) => !Number.isNaN(Number(n)))
    const chains = Object.values(Chains)

    // all enums has chains export
    expect(ids.length).toEqual(chains.length)

    // all chains has enum mapped
    ids.forEach((chainId) => {
      expect(chains.find((chain) => chainId === chain.id)).toBeTruthy()
    })
  })
})
