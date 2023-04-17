import { bscTestnetTokens } from '@pancakeswap/tokens'

import { PoolCategory, SerializedPool } from '../../types'

export const livePools: SerializedPool[] = [
  {
    sousId: 1,
    stakingToken: bscTestnetTokens.cake2,
    earningToken: bscTestnetTokens.mockA,
    contractAddress: {
      97: '0xe7080E3afDfF2322080B5ba85700FE41287D864B',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.01',
  },
  {
    sousId: 2,
    stakingToken: bscTestnetTokens.mockA,
    earningToken: bscTestnetTokens.mockB,
    contractAddress: {
      97: '0x31a069925fb770202b302c7911af1acbe0395420',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.01',
  },
].map((p) => ({
  ...p,
  stakingToken: p.stakingToken.serialize,
  earningToken: p.earningToken.serialize,
}))

// known finished pools
export const finishedPools: SerializedPool[] = []

export const pools: SerializedPool[] = [...livePools, ...finishedPools]
