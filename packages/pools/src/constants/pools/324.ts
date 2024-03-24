import { zksyncTokens } from '@pancakeswap/tokens'
import { getAddress } from 'viem'

import { PoolCategory, SerializedPool } from '../../types'

export const livePools: SerializedPool[] = [
  {
    sousId: 2,
    stakingToken: zksyncTokens.cake,
    earningToken: zksyncTokens.meow,
    contractAddress: '0x3BF2521A44502eDC06efA069be66694ec4d3AB65',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '765.8656',
    version: 3,
  },
].map((p) => ({
  ...p,
  contractAddress: getAddress(p.contractAddress),
  stakingToken: p.stakingToken.serialize,
  earningToken: p.earningToken.serialize,
}))

// known finished pools
export const finishedPools: SerializedPool[] = [
  {
    sousId: 1,
    stakingToken: zksyncTokens.cake,
    earningToken: zksyncTokens.tes,
    contractAddress: '0xedB2E9eB4fc47d57c08B387775e09E5fC9e21EBE',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.02546',
    version: 3,
  },
].map((p) => ({
  ...p,
  isFinished: true,
  contractAddress: getAddress(p.contractAddress),
  stakingToken: p.stakingToken.serialize,
  earningToken: p.earningToken.serialize,
}))

export const pools: SerializedPool[] = [...livePools, ...finishedPools]
