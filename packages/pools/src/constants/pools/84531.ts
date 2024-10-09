import { getAddress } from 'viem'
import { baseTestnetTokens } from '@pancakeswap/tokens'
import { PoolCategory, SerializedPool } from '../../types'

export const livePools: SerializedPool[] = [
  {
    sousId: 4,
    stakingToken: baseTestnetTokens.cake,
    earningToken: baseTestnetTokens.mockA,
    contractAddress: '0x55F8912596F06453466e208e79AB808328146d06',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.01',
    version: 3,
  },
  {
    sousId: 3,
    stakingToken: baseTestnetTokens.cake,
    earningToken: baseTestnetTokens.mockA,
    contractAddress: '0xE61a1065B740a61950E08C073833B85D3362f48B',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.01',
    version: 3,
  },
  {
    sousId: 2,
    stakingToken: baseTestnetTokens.cake,
    earningToken: baseTestnetTokens.mockA,
    contractAddress: '0xF9991a0e33115c1B7e0690109115747ab5C48D9E',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.01',
    version: 3,
  },
  {
    sousId: 1,
    stakingToken: baseTestnetTokens.cake,
    earningToken: baseTestnetTokens.mockA,
    contractAddress: '0x35DB927618560B8878543ea0019A8E664581ADb5',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.01',
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
