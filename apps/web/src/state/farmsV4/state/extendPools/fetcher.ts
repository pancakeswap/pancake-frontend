import { getChainNameInKebabCase } from '@pancakeswap/chains'
import { UNIVERSAL_FARMS, UNIVERSAL_FARMS_MAP } from '@pancakeswap/farms'
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

  return {
    pools: parseFarmPools(rows),
    endCursor,
    startCursor,
    hasNextPage,
    hasPrevPage,
  }
}

const composeFarmConfig = (farm: PoolInfo) => {
  if (farm.protocol !== 'stable' && farm.protocol !== 'v2') return farm

  const localFarm = UNIVERSAL_FARMS_MAP[`${farm.chainId}:${farm.lpAddress}`] as V2PoolInfo | StablePoolInfo | undefined

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
  const isFarming = UNIVERSAL_FARMS.some((farm) => farm.lpAddress === poolAddress)

  return composeFarmConfig(parseFarmPools([resp.data], { isFarming })[0]) as TPoolType
}
