import { ethereumTokens } from '@pancakeswap/tokens'
import { getAddress } from 'viem'

import { PoolCategory, SerializedPool } from '../../types'

export const livePools: SerializedPool[] = [
  {
    sousId: 6,
    stakingToken: ethereumTokens.cake,
    earningToken: ethereumTokens.rpl,
    contractAddress: '0x3f0bCCa8f5aA37e184B22e3A2ca8C292fe6B716B',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.0005093',
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
    stakingToken: ethereumTokens.cake,
    earningToken: ethereumTokens.rpl,
    contractAddress: '0x0A150c0AbbbD852ec8940AeE67A1aB59d9Fe76d1',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.000331',
  },
  {
    sousId: 1,
    stakingToken: ethereumTokens.cake,
    earningToken: ethereumTokens.wncg,
    contractAddress: '0x5eC855219e236b75E7cfba0D56105b9Cc88B4A18',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.04061',
  },
  {
    sousId: 4,
    stakingToken: ethereumTokens.cake,
    earningToken: ethereumTokens.rpl,
    contractAddress: '0xd7136B50E641CfFf9D0aeB5c4617c779A80F0c8b',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.000282',
  },
  {
    sousId: 3,
    stakingToken: ethereumTokens.cake,
    earningToken: ethereumTokens.alcx,
    contractAddress: '0x5A8C87047c290dD8A2e1a1a2D2341Da41d1Aa009',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.0002989',
  },
  {
    sousId: 2,
    stakingToken: ethereumTokens.cake,
    earningToken: ethereumTokens.ush,
    contractAddress: '0x3Bb1CCa68756a7E0ffEBf59d52174784047f3dE8',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.04629',
  },
].map((p) => ({
  ...p,
  isFinished: true,
  contractAddress: getAddress(p.contractAddress),
  stakingToken: p.stakingToken.serialize,
  earningToken: p.earningToken.serialize,
}))

export const pools: SerializedPool[] = [...livePools, ...finishedPools]
