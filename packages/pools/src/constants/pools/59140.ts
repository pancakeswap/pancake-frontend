import { getAddress } from 'viem'
import { lineaTestnetTokens } from '@pancakeswap/tokens'
import { PoolCategory, SerializedPool } from '../../types'

export const livePools: SerializedPool[] = [
  {
    sousId: 4,
    stakingToken: lineaTestnetTokens.cake,
    earningToken: lineaTestnetTokens.mockA,
    contractAddress: '0x5d4A2dCefA1B6D5031f57a05651F0b49f4E0eC74',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.01',
    version: 3,
  },
  {
    sousId: 3,
    stakingToken: lineaTestnetTokens.cake,
    earningToken: lineaTestnetTokens.mockA,
    contractAddress: '0xa014641f932E8b7985Ffd6F722DfE6995bbA15aF',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.01',
    version: 3,
  },
  {
    sousId: 2,
    stakingToken: lineaTestnetTokens.cake,
    earningToken: lineaTestnetTokens.mockA,
    contractAddress: '0x4dc9C14A5542f3D0544a6c11d717AD04A70afF8C',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.01',
    version: 3,
  },
  {
    sousId: 1,
    stakingToken: lineaTestnetTokens.cake,
    earningToken: lineaTestnetTokens.mockA,
    contractAddress: '0x30669C960b90Eb71DB4173D8b5069ca83CD2d400',
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
