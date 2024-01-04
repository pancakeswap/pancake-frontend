import { arbitrumTokens } from '@pancakeswap/tokens'
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
    sousId: 3,
    stakingToken: arbitrumTokens.alp,
    earningToken: arbitrumTokens.cake,
    contractAddress: '0x85146C0c5968d9640121eebd13030c99298f87b3',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.00615',
    version: 3,
  },
  {
    sousId: 2,
    stakingToken: arbitrumTokens.alp,
    earningToken: arbitrumTokens.cake,
    contractAddress: '0x0639c5715EC308E16f089c96C0C109302d76FA81',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.01177',
    version: 3,
  },
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
  isFinished: true,
  contractAddress: getAddress(p.contractAddress),
  stakingToken: p.stakingToken.serialize,
  earningToken: p.earningToken.serialize,
}))

export const pools: SerializedPool[] = [...livePools, ...finishedPools]
