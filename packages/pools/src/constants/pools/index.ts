import { ChainId } from '@pancakeswap/chains'
import { SerializedPool } from '../../types'
import { isPoolsSupported } from '../../utils/isPoolsSupported'
import { POOLS_API } from '../config/endpoint'

export const getPoolsConfig = async (chainId: ChainId) => {
  if (!isPoolsSupported(chainId)) {
    return undefined
  }

  try {
    const response = await fetch(`${POOLS_API}?chainId=${chainId}`)
    const result: SerializedPool[] = await response.json()
    return result
  } catch (error) {
    console.error('Get all pools by chain config error: ', error)
    return []
  }
}

export const getLivePoolsConfig = async (chainId: ChainId) => {
  if (!isPoolsSupported(chainId)) {
    return undefined
  }

  try {
    const response = await fetch(`${POOLS_API}?chainId=${chainId}&isFinished=false`)
    const result: SerializedPool[] = await response.json()
    return result
  } catch (error) {
    console.error('Get live pools by chain config error: ', error)
    return []
  }
}

export const MAX_LOCK_DURATION = 31536000
export const UNLOCK_FREE_DURATION = 604800
export const ONE_WEEK_DEFAULT = 604800
export const BOOST_WEIGHT = 20000000000000n
export const DURATION_FACTOR = 31536000n
