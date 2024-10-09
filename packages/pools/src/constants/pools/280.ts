import { zkSyncTestnetTokens } from '@pancakeswap/tokens'
import { getAddress } from 'viem'

import { PoolCategory, SerializedPool } from '../../types'

export const livePools: SerializedPool[] = [
  {
    sousId: 4,
    stakingToken: zkSyncTestnetTokens.cake,
    earningToken: zkSyncTestnetTokens.mock,
    contractAddress: '0x4BDFF8A608be623077E54F6916761f631e87D884',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.01',
    version: 3,
  },
  {
    sousId: 3,
    stakingToken: zkSyncTestnetTokens.cake,
    earningToken: zkSyncTestnetTokens.mock,
    contractAddress: '0x926E99bad2BC7dA5c0880f0bebD7f448Be86562B',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.01',
    version: 3,
  },
  {
    sousId: 2,
    stakingToken: zkSyncTestnetTokens.cake,
    earningToken: zkSyncTestnetTokens.mock,
    contractAddress: '0x5F7Cc0C5E3FC6e26bC98d392fa3516D4F33Df8aD',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.01',
    version: 3,
  },
  {
    sousId: 1,
    stakingToken: zkSyncTestnetTokens.cake,
    earningToken: zkSyncTestnetTokens.mock,
    contractAddress: '0x455d2eBbfb172CDba2D499cAf36cBbF5366F976D',
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
