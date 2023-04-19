import { ethereumTokens } from '@pancakeswap/tokens'

import { PoolCategory, SerializedPool } from '../../types'

export const livePools: SerializedPool[] = [
  {
    sousId: 1,
    stakingToken: ethereumTokens.cake,
    earningToken: ethereumTokens.usdt,
    contractAddress: '0x83492ae058cefACa420b6faef25619DA3cC8DC87',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.000231',
  },
].map((p) => ({
  ...p,
  stakingToken: p.stakingToken.serialize,
  earningToken: p.earningToken.serialize,
}))

// known finished pools
export const finishedPools: SerializedPool[] = []

export const pools: SerializedPool[] = [...livePools, ...finishedPools]
