import { getChainNameInKebabCase } from '@pancakeswap/chains'
import { fetchAllUniversalFarms, fetchAllUniversalFarmsMap } from '@pancakeswap/farms'
import set from 'lodash/set'
import { chainIdToExplorerInfoChainName, explorerApiClient } from 'state/info/api/client'
import { PoolInfo, StablePoolInfo, V2PoolInfo } from '../type'
import { parseFarmPools } from '../utils'
import { ExtendPoolsQuery } from './atom'

export const fetchExplorerPoolsList = async (query: Required<ExtendPoolsQuery>, signal?: AbortSignal) => {
  const resp = await explorerApiClient.GET('/cached/pools/list', {
    signal,
    params: {
      query: {
        chains: query.chains.map((chain) => getChainNameInKebabCase(chain)) as any[],
        protocols: query.protocols,
        orderBy: query.orderBy,
        pools: query.pools,
        tokens: query.tokens,
        before: query.before,
        after: query.after,
      },
    },
  })

  if (!resp.data) {
    return {
      pools: [],
      endCursor: '',
      startCursor: '',
      hasNextPage: false,
      hasPrevPage: false,
    }
  }

  const { rows, endCursor, startCursor, hasNextPage, hasPrevPage } = resp.data
  const pools = await parseFarmPools(rows)

  return {
    pools,
    endCursor,
    startCursor,
    hasNextPage,
    hasPrevPage,
  }
}

const composeFarmConfig = async (farm: PoolInfo) => {
  if (farm.protocol !== 'stable' && farm.protocol !== 'v2') return farm

  const farmConfig = await fetchAllUniversalFarmsMap()
  const localFarm = farmConfig[`${farm.chainId}:${farm.lpAddress}`] as V2PoolInfo | StablePoolInfo | undefined

  if (!localFarm) {
    return farm
  }

  set(farm, 'bCakeWrapperAddress', localFarm.bCakeWrapperAddress)

  return farm
}

export const fetchExplorerPoolInfo = async <TPoolType extends PoolInfo>(
  poolAddress: string,
  chainId: number,
  signal?: AbortSignal,
): Promise<TPoolType | null> => {
  const chainName = chainIdToExplorerInfoChainName[chainId]
  const resp = await explorerApiClient.GET('/cached/pools/{chainName}/{id}', {
    signal,
    params: {
      path: {
        chainName,
        id: poolAddress,
      },
    },
  })

  if (!resp.data) {
    return null
  }
  // @ts-ignore
  resp.data.chainId = chainId
  const farmConfig = await fetchAllUniversalFarms()
  const isFarming = farmConfig.some((farm) => farm.lpAddress.toLowerCase() === poolAddress.toLowerCase())
  const farm = await parseFarmPools([resp.data], { isFarming })
  const data = await composeFarmConfig(farm[0])

  return data as TPoolType
}
