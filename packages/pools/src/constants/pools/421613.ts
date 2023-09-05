import { arbitrumGoerliTokens } from '@pancakeswap/tokens'
import { getAddress } from 'viem'

import { PoolCategory, SerializedPool } from '../../types'

export const livePools: SerializedPool[] = [
  {
    sousId: 5,
    stakingToken: arbitrumGoerliTokens.cake,
    earningToken: arbitrumGoerliTokens.mockA,
    contractAddress: '0x291f459243621E7d7c83a67644D87022F1FC39F5',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.01',
    version: 3,
  },
  {
    sousId: 4,
    stakingToken: arbitrumGoerliTokens.cake,
    earningToken: arbitrumGoerliTokens.mockA,
    contractAddress: '0xbA17c9f21bDea078c54F263a8cc63227F28EBfF8',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.01',
    version: 3,
  },
  {
    sousId: 3,
    stakingToken: arbitrumGoerliTokens.cake,
    earningToken: arbitrumGoerliTokens.mockA,
    contractAddress: '0xdDa7E82fF3c7b308c7f91a7080e474e41173F7f1',
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
export const finishedPools: SerializedPool[] = [
  {
    sousId: 2,
    stakingToken: arbitrumGoerliTokens.cake,
    earningToken: arbitrumGoerliTokens.mockA,
    contractAddress: '0x4aB4ec9EC094E6042E822A73Cd3979A946280E56',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.01',
    version: 3,
  },
  {
    sousId: 1,
    stakingToken: arbitrumGoerliTokens.cake,
    earningToken: arbitrumGoerliTokens.mockA,
    contractAddress: '0x5b37404299Ef7DCABA32B00A8f36f0F43eC28E92',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.01',
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
