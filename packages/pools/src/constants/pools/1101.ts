import { polygonZkEvmTokens } from '@pancakeswap/tokens'
import { getAddress } from 'viem'
import { PoolCategory, SerializedPool } from '../../types'

export const livePools: SerializedPool[] = [
  {
    sousId: 1,
    stakingToken: polygonZkEvmTokens.cake,
    earningToken: polygonZkEvmTokens.pol,
    contractAddress: '0x3BF2521A44502eDC06efA069be66694ec4d3AB65',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.0055',
    version: 3,
  },
].map((p) => ({
  ...p,
  isFinished: false,
  contractAddress: getAddress(p.contractAddress),
  stakingToken: p.stakingToken.serialize,
  earningToken: p.earningToken.serialize,
}))

// known finished pools
export const finishedPools: SerializedPool[] = []

export const pools: SerializedPool[] = [...livePools, ...finishedPools]
