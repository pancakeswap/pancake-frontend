import { opBnbTokens } from '@pancakeswap/tokens'
import { getAddress } from 'viem'

import { PoolCategory, SerializedPool } from '../../types'

export const livePools: SerializedPool[] = []
// .map((p) => ({
//   ...p,
//   contractAddress: getAddress(p.contractAddress),
//   stakingToken: p.stakingToken.serialize,
//   earningToken: p.earningToken.serialize,
// }))

// known finished pools
export const finishedPools: SerializedPool[] = [
  {
    sousId: 1,
    stakingToken: opBnbTokens.alp,
    earningToken: opBnbTokens.cake,
    contractAddress: '0xa1B46Cb13b43fb8Ae5dC7222e3294fcd10024168',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.005787',
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
