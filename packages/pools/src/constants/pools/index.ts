import { ChainId } from '@pancakeswap/chains'
import { SerializedPool } from '../../types'
import { isPoolsSupported } from '../../utils/isPoolsSupported'
import { POOLS_API } from '../config/endpoint'

const poolCache: Record<string, SerializedPool[] | undefined> = {}
const fetchRequests: Record<string, Promise<SerializedPool[]> | undefined> = {}

export const getPoolsConfig = async (chainId: ChainId) => {
  if (!isPoolsSupported(chainId)) {
    return undefined
  }

  // Check if the pools are already cached
  if (poolCache[chainId]) {
    return poolCache[chainId]
  }

  // Check if a fetch request is already in progress for this chainId
  if (fetchRequests[chainId]) {
    return fetchRequests[chainId]
  }

  const fetchPoolConfig = async () => {
    try {
      const response = await fetch(`${POOLS_API}?chainId=${chainId}`, {
        signal: AbortSignal.timeout(3000),
      })
      if (response.ok) {
        const pools = await response.json()
        if (!pools) {
          throw new Error(`Unexpected empty pool fetched from remote ${pools}`)
        }

        // Cache the result before returning
        poolCache[chainId] = pools
        return pools
      }
      throw new Error(`Fetch failed with status: ${response.status}`)
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`Fetch failed: ${e.message}`)
      } else {
        throw new Error(`Fetch failed: ${e}`)
      }
    } finally {
      // Clear the ongoing fetch request after completion or failure
      fetchRequests[chainId] = undefined
    }
  }

  // Store the ongoing fetch request in the cache
  fetchRequests[chainId] = fetchPoolConfig()
  return fetchRequests[chainId]
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
