import { ChainId } from '@pancakeswap/chains'

type V3PoolFetchConfig = {
  gasLimit: bigint
  retryGasMultiplier: number
}

const DEFAULT_FETCH_CONFIG: V3PoolFetchConfig = {
  gasLimit: 3000000n,
  retryGasMultiplier: 2,
}

const V3_POOL_FETCH_CONFIG: { [key in ChainId]?: V3PoolFetchConfig } = {}

export function getV3PoolFetchConfig(chainId: ChainId) {
  return V3_POOL_FETCH_CONFIG[chainId] || DEFAULT_FETCH_CONFIG
}
