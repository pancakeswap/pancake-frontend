import { arbitrumTokens } from '@pancakeswap/tokens'
import { getAddress } from 'viem'

import { PoolCategory, SerializedPool } from '../../types'

export const livePools: SerializedPool[] = [
  {
    sousId: 1,
    stakingToken: arbitrumTokens.cake,
    earningToken: arbitrumTokens.mockA,
    contractAddress: '0x1b08a836d43719EF2a7D8F3bb2A093EF3DBc9D09',
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '0.01',
    version: 3,
  },
].map((p) => ({
  ...p,
  contractAddress: getAddress(p.contractAddress),
  stakingToken: p.stakingToken.serialize,
  earningToken: p.earningToken.serialize,
}))

// known finished pools
export const finishedPools: SerializedPool[] = []

export const pools: SerializedPool[] = [...livePools, ...finishedPools]
