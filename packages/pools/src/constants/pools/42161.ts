import { arbitrumTokens } from '@pancakeswap/tokens'
import { getAddress } from 'viem'

import { PoolCategory, SerializedPool } from '../../types'

export const livePools: SerializedPool[] = [
  {
    sousId: 1,
    stakingToken: arbitrumTokens.alp,
    earningToken: arbitrumTokens.cake,
    contractAddress: '0x3dBdE2682330105902fb482d9849C270aa8E0881',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.01135',
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
