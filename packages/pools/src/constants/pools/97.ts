import { SerializedPool } from '../../types'

export const livePools: SerializedPool[] = []

// known finished pools
const finishedPools: SerializedPool[] = []

export const pools: SerializedPool[] = [...livePools, ...finishedPools]
