// import { zkSyncTestnetTokens } from '@pancakeswap/tokens'
// import { getAddress } from 'viem'

import { SerializedPool } from '../../types'

export const livePools: SerializedPool[] = []

// known finished pools
export const finishedPools: SerializedPool[] = []

export const pools: SerializedPool[] = [...livePools, ...finishedPools]
