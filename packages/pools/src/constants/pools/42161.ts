import { arbitrumTokens } from '@pancakeswap/tokens'
import { getAddress } from 'viem'

import { PoolCategory, SerializedPool } from '../../types'

export const livePools: SerializedPool[] = [
  {
    sousId: 7,
    stakingToken: arbitrumTokens.cake,
    earningToken: arbitrumTokens.egp,
    contractAddress: '0xd8c20746A3045859D20171C9a47261378AdfbDdE',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.000643004',
    version: 3,
  },
  {
    sousId: 6,
    stakingToken: arbitrumTokens.alp,
    earningToken: arbitrumTokens.arb,
    contractAddress: '0xaA0DE632A4071642d72Ceb03577F5534ea196927',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.043402',
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
    sousId: 5,
    stakingToken: arbitrumTokens.alp,
    earningToken: arbitrumTokens.arb,
    contractAddress: '0xD2e71125ec0313874d578454E28086fba7444c0c',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.0310019841',
    version: 3,
  },
  {
    sousId: 4,
    stakingToken: arbitrumTokens.alp,
    earningToken: arbitrumTokens.arb,
    contractAddress: '0xCe10072E051DA9B8e297AC439B3d7c5C45A32c8f',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.0310019841',
    version: 3,
  },
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
