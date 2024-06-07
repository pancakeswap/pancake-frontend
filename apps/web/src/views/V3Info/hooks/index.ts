import { ChainId } from '@pancakeswap/chains'
import dayjs from 'dayjs'
import { GraphQLClient } from 'graphql-request'
import { useMemo } from 'react'
import { multiChainId, multiChainName } from 'state/info/constant'
import { useChainNameByQuery } from 'state/info/hooks'
import { Block } from 'state/info/types'
import { getChainName } from 'state/info/utils'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import { v3Clients, v3InfoClients } from 'utils/graphql'
import { useBlockFromTimeStampQuery } from 'views/Info/hooks/useBlocksFromTimestamps'

import { useQuery } from '@tanstack/react-query'
import { getPercentChange } from 'views/V3Info/utils/data'
import { components } from 'state/info/api/schema'
import { chainIdToExplorerInfoChainName, explorerApiClient } from 'state/info/api/client'
import { DURATION_INTERVAL, SUBGRAPH_START_BLOCK } from '../constants'
import { fetchPoolChartData } from '../data/pool/chartData'
import { fetchPoolDatas } from '../data/pool/poolData'
import { PoolTickData, fetchTicksSurroundingPrice } from '../data/pool/tickData'
import { fetchPoolTransactions } from '../data/pool/transactions'
import { fetchChartData } from '../data/protocol/chart'
import { fetchProtocolData } from '../data/protocol/overview'
import { fetchTopTransactions } from '../data/protocol/transactions'
import { fetchSearchResults } from '../data/search'
import { fetchTokenChartData } from '../data/token/chartData'
import { fetchPoolsForToken } from '../data/token/poolsForToken'
import { fetchPairPriceChartTokenData, fetchTokenPriceData } from '../data/token/priceData'
import { fetchedTokenDatas } from '../data/token/tokenData'
import { fetchTokenTransactions } from '../data/token/transactions'
import {
  ChartDayData,
  PoolChartEntry,
  PoolData,
  PriceChartEntry,
  ProtocolData,
  TokenChartEntry,
  TokenData,
  Transaction,
} from '../types'

const QUERY_SETTINGS_IMMUTABLE = {
  retry: 3,
  retryDelay: 3000,
  keepPreviousData: true,
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
}

export const useProtocolChartData = (): ChartDayData[] | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]
  const { data: chartData } = useQuery({
    queryKey: [`v3/info/protocol/ProtocolChartData/${chainId}`, chainId],
    queryFn: () => fetchChartData('v3', chainIdToExplorerInfoChainName[chainId]),
    enabled: Boolean(chainId),
    ...QUERY_SETTINGS_IMMUTABLE,
  })
  return useMemo(() => chartData?.data ?? [], [chartData])
}

export const useProtocolData = (): ProtocolData | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]
  const [t24, t48] = getDeltaTimestamps()
  const { blocks } = useBlockFromTimeStampQuery([t24, t48])
  const { data } = useQuery({
    queryKey: [`v3/info/protocol/ProtocolData/${chainId}`, chainId],
    queryFn: () => fetchProtocolData(v3InfoClients[chainId], blocks),
    enabled: Boolean(chainId && blocks && blocks.length > 0),
    ...QUERY_SETTINGS_IMMUTABLE,
  })
  return data?.data ?? undefined
}

export const useProtocolTransactionData = (): Transaction[] | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]
  const { data } = useQuery({
    queryKey: [`v3/info/protocol/ProtocolTransactionData/${chainId}`, chainId],
    queryFn: () => fetchTopTransactions(chainIdToExplorerInfoChainName[chainId]),
    enabled: Boolean(chainId),
    ...QUERY_SETTINGS_IMMUTABLE,
  })
  return useMemo(() => data?.filter((d) => d.amountUSD > 0) ?? [], [data])
}

// this is for the swap page and ROI calculator
export const usePairPriceChartTokenData = (
  address?: string,
  duration?: 'day' | 'week' | 'month' | 'year',
  targetChainId?: ChainId,
  enabled = true,
): { data: PriceChartEntry[] | undefined; maxPrice?: number; minPrice?: number; averagePrice?: number } => {
  const chainName = useChainNameByQuery()
  const chainId = targetChainId || multiChainId[chainName]

  const { data } = useQuery({
    queryKey: [`v3/info/token/pairPriceChartToken/${address}/${duration}`, targetChainId ?? chainId],

    queryFn: async () => {
      if (!address) {
        throw new Error('Address is not defined')
      }
      const utcCurrentTime = dayjs()
      const startTimestamp = utcCurrentTime
        .subtract(1, duration ?? 'day')
        .startOf('hour')
        .unix()
      return fetchPairPriceChartTokenData(
        address,
        DURATION_INTERVAL[duration ?? 'day'],
        startTimestamp,
        v3Clients[targetChainId ?? chainId],
        multiChainName[targetChainId ?? chainId],
        SUBGRAPH_START_BLOCK[chainId],
      )
    },

    enabled: Boolean(enabled && chainId && address),
    ...QUERY_SETTINGS_IMMUTABLE,
  })
  return useMemo(
    () => ({
      data: data?.data ?? [],
      maxPrice: data?.maxPrice,
      minPrice: data?.minPrice,
      averagePrice: data?.averagePrice,
    }),
    [data],
  )
}

export async function fetchTopTokens(chainName: components['schemas']['ChainName'], signal: AbortSignal) {
  try {
    const data = await explorerApiClient
      .GET('/cached/tokens/v3/{chainName}/list/top', {
        signal,
        params: {
          path: {
            chainName,
          },
        },
      })
      .then((res) => res.data)
    if (!data) {
      return {
        data: {},
        error: false,
      }
    }
    return {
      data: data.reduce(
        (acc, item) => {
          // eslint-disable-next-line no-param-reassign
          acc[item.id] = {
            ...item,
            address: item.id,
            volumeUSD: parseFloat(item.volumeUSD24h || '0'),
            volumeUSDWeek: parseFloat(item.volumeUSD7d || '0'),
            tvlUSD: parseFloat(item.tvlUSD),
            volumeUSDChange: 0,
            tvlUSDChange: 0,
            exists: false,
            txCount: item.txCount24h,
            feesUSD: parseFloat(item.feeUSD24h),
            tvlToken: 0,
            priceUSDChange: getPercentChange(item.priceUSD, item.priceUSD24h),
            priceUSDChangeWeek: 0,
            priceUSD: parseFloat(item.priceUSD),
          }
          return acc
        },
        {} as {
          [address: string]: TokenData
        },
      ),
      error: false,
    }
  } catch (e) {
    console.error(e)
    return {
      data: {},
      error: true,
    }
  }
}

export const useTopTokensData = ():
  | {
      [address: string]: TokenData
    }
  | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]

  const { data } = useQuery({
    queryKey: [`v3/info/token/TopTokensData/${chainId}`, chainId],

    queryFn: ({ signal }) => fetchTopTokens(chainIdToExplorerInfoChainName[chainId], signal),
    enabled: Boolean(chainId),
    ...QUERY_SETTINGS_IMMUTABLE,
  })
  return data?.data
}

const graphPerPage = 50

const tokenDataFetcher = (dataClient: GraphQLClient, tokenAddresses: string[], blocks?: Block[]) => {
  const times = Math.ceil(tokenAddresses.length / graphPerPage)
  const addressGroup: Array<string[]> = []
  for (let i = 0; i < times; i++) {
    addressGroup.push(tokenAddresses.slice(i * graphPerPage, (i + 1) * graphPerPage))
  }
  return Promise.all(addressGroup.map((d) => fetchedTokenDatas(dataClient, d, blocks)))
}
export const useTokensData = (addresses: string[], targetChainId?: ChainId): TokenData[] | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = targetChainId ?? multiChainId[chainName]
  const [t24, t48, t7d] = getDeltaTimestamps()
  const { blocks } = useBlockFromTimeStampQuery([t24, t48, t7d], undefined, undefined, getChainName(chainId))

  const { data } = useQuery({
    queryKey: [`v3/info/token/tokensData/${targetChainId}/${addresses?.join()}`, chainId],

    queryFn: () =>
      tokenDataFetcher(
        v3InfoClients[chainId], // TODO:  v3InfoClients[chainId],
        addresses,
        blocks?.filter((d) => d.number >= SUBGRAPH_START_BLOCK[chainId]),
      ),

    enabled: Boolean(chainId && blocks && addresses && addresses?.length > 0 && blocks?.length > 0),
    ...QUERY_SETTINGS_IMMUTABLE,
  })
  const allTokensData = useMemo(() => {
    if (data) {
      return data.reduce((acc, d) => {
        return { ...acc, ...d.data }
      }, {})
    }
    return undefined
  }, [data])

  return useMemo(() => (allTokensData ? Object.values(allTokensData) : undefined), [allTokensData])
}

export const useTokenData = (address: string): TokenData | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]
  const [t24, t48, t7d] = getDeltaTimestamps()
  const { blocks } = useBlockFromTimeStampQuery([t24, t48, t7d])

  const { data } = useQuery({
    queryKey: [`v3/info/token/tokenData/${chainId}/${address}`, chainId],

    queryFn: () =>
      fetchedTokenDatas(
        v3InfoClients[chainId],
        [address],
        blocks?.filter((d) => d.number >= SUBGRAPH_START_BLOCK[chainId]),
      ),

    enabled: Boolean(chainId && blocks && address && address !== 'undefined' && blocks?.length > 0),
    ...QUERY_SETTINGS_IMMUTABLE,
  })

  return data?.data?.[address]
}

export const usePoolsForToken = (address: string): string[] | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]
  const { data } = useQuery({
    queryKey: [`v3/info/token/poolsForToken/${chainId}/${address}`, chainId],
    queryFn: () => fetchPoolsForToken(address, v3InfoClients[chainId]),
    enabled: Boolean(chainId && address),
    ...QUERY_SETTINGS_IMMUTABLE,
  })
  return data?.addresses
}

export const useTokenChartData = (address: string): TokenChartEntry[] | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]

  const { data } = useQuery({
    queryKey: [`v3/info/token/tokenChartData/${chainId}/${address}`, chainId],
    queryFn: () => fetchTokenChartData('v3', chainIdToExplorerInfoChainName[chainId], address),
    enabled: Boolean(chainId && address),
    ...QUERY_SETTINGS_IMMUTABLE,
  })
  return data?.data
}

export const useTokenPriceData = (
  address: string,
  duration: 'day' | 'week' | 'month' | 'year',
): PriceChartEntry[] | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]

  const { data } = useQuery({
    queryKey: [`v3/info/token/tokenPriceData/${chainId}/${address}/${duration}`, chainId],

    queryFn: () => fetchTokenPriceData(address, 'v3', duration, chainIdToExplorerInfoChainName[chainId]),

    enabled: Boolean(chainId && address),
    ...QUERY_SETTINGS_IMMUTABLE,
  })
  return data?.data
}

export const useTokenTransactions = (address: string): Transaction[] | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]
  const { data } = useQuery({
    queryKey: [`v3/info/token/tokenTransaction/${chainId}/${address}`, chainId],
    queryFn: () => fetchTokenTransactions(address, chainIdToExplorerInfoChainName[chainId]),
    enabled: Boolean(chainId && address),
    ...QUERY_SETTINGS_IMMUTABLE,
  })
  return useMemo(() => data?.data?.filter((d) => d.amountUSD > 0), [data])
}

export async function fetchTopPools(chainName: components['schemas']['ChainName'], signal: AbortSignal) {
  try {
    const data = await explorerApiClient
      .GET('/cached/pools/v3/{chainName}/list/top', {
        signal,
        params: {
          path: {
            chainName,
          },
        },
      })
      .then((res) => res.data)
    if (!data) {
      return {
        data: {},
        error: false,
      }
    }
    return {
      data: data.reduce(
        (acc, item) => {
          // eslint-disable-next-line no-param-reassign
          acc[item.id] = {
            ...item,
            address: item.id,
            volumeUSD: parseFloat(item.volumeUSD24h),
            volumeUSDWeek: parseFloat(item.volumeUSD7d),
            token0: { ...item.token0, address: item.token0.id, derivedETH: 0 },
            token1: { ...item.token1, address: item.token1.id, derivedETH: 0 },
            feeUSD: item.totalFeeUSD,
            liquidity: parseFloat(item.liquidity),
            sqrtPrice: parseFloat(item.sqrtPrice),
            tick: item.tick ?? 0,
            tvlUSD: parseFloat(item.tvlUSD),
            token0Price: parseFloat(item.token0Price),
            token1Price: parseFloat(item.token1Price),
            tvlToken0: parseFloat(item.tvlToken0),
            tvlToken1: parseFloat(item.tvlToken1),
            volumeUSDChange: 0,
            tvlUSDChange: 0,
          }
          return acc
        },
        {} as {
          [address: string]: PoolData
        },
      ),
      error: false,
    }
  } catch (e) {
    console.error(e)
    return {
      data: {},
      error: true,
    }
  }
}

export const useTopPoolsData = ():
  | {
      [address: string]: PoolData
    }
  | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]

  const { data } = useQuery({
    queryKey: [`v3/info/pool/TopPoolsData/${chainId}`, chainId],

    queryFn: async ({ signal }) => {
      return fetchTopPools(chainIdToExplorerInfoChainName[chainId], signal)
    },
    enabled: Boolean(chainId),
    ...QUERY_SETTINGS_IMMUTABLE,
  })
  return data?.data
}

export const usePoolsData = (addresses: string[]): PoolData[] | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]
  const [t24, t48, t7d] = getDeltaTimestamps()
  const { blocks } = useBlockFromTimeStampQuery([t24, t48, t7d])

  const { data } = useQuery({
    queryKey: [`v3/info/pool/poolsData/${chainId}/${addresses.join()}`, chainId],

    queryFn: () =>
      fetchPoolDatas(
        v3InfoClients[chainId],
        addresses,
        blocks?.filter((d) => d.number >= SUBGRAPH_START_BLOCK[chainId]),
      ),

    enabled: Boolean(chainId && blocks && blocks?.length > 0 && addresses && addresses?.length > 0),
    ...QUERY_SETTINGS_IMMUTABLE,
  })
  return useMemo(() => (data?.data ? Object.values(data.data) : undefined), [data])
}

export const usePoolData = (address: string): PoolData | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]
  const [t24, t48, t7d] = getDeltaTimestamps()
  const { blocks } = useBlockFromTimeStampQuery([t24, t48, t7d])

  const { data } = useQuery({
    queryKey: [`v3/info/pool/poolData/${chainId}/${address}`, chainId],

    queryFn: () =>
      fetchPoolDatas(
        v3InfoClients[chainId],
        [address],
        blocks?.filter((d) => d.number >= SUBGRAPH_START_BLOCK[chainId]),
      ),

    enabled: Boolean(chainId && blocks && blocks?.length > 0 && address && address !== 'undefined'),
    ...QUERY_SETTINGS_IMMUTABLE,
  })
  return data?.data?.[address] ?? undefined
}
export const usePoolTransactions = (address: string): Transaction[] | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]

  const { data } = useQuery({
    queryKey: [`v3/info/pool/poolTransaction/${chainId}/${address}`, chainId],
    queryFn: () => fetchPoolTransactions(address, chainIdToExplorerInfoChainName[chainId]),
    enabled: Boolean(chainId && address),
    ...QUERY_SETTINGS_IMMUTABLE,
  })
  return useMemo(() => data?.data?.filter((d) => d.amountUSD > 0) ?? undefined, [data])
}

export const usePoolChartData = (address: string): PoolChartEntry[] | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]
  const { data } = useQuery({
    queryKey: [`v3/info/pool/poolChartData/${chainId}/${address}`, chainId],
    queryFn: () => fetchPoolChartData('v3', chainIdToExplorerInfoChainName[chainId], address),
    enabled: Boolean(chainId && address && address !== 'undefined'),
    ...QUERY_SETTINGS_IMMUTABLE,
  })
  return data?.data
}

export const usePoolTickData = (address: string): PoolTickData | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]

  const { data } = useQuery({
    queryKey: [`v3/info/pool/poolTickData/${chainId}/${address}`, chainId],
    queryFn: () => fetchTicksSurroundingPrice(address, v3InfoClients[chainId], chainId),
    enabled: Boolean(chainId && address),
    ...QUERY_SETTINGS_IMMUTABLE,
  })
  return data?.data ?? undefined
}

export const useSearchData = (
  searchValue: string,
): { tokens: TokenData[]; pools: PoolData[]; loading: boolean; error: any } => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]
  const [t24, t48, t7d] = getDeltaTimestamps()
  const { blocks } = useBlockFromTimeStampQuery([t24, t48, t7d])
  const { data, status, error } = useQuery({
    queryKey: [`v3/info/pool/searchData/${chainId}/${searchValue}`, chainId],

    queryFn: () =>
      fetchSearchResults(
        v3InfoClients[chainId],
        searchValue,
        blocks?.filter((d) => d.number >= SUBGRAPH_START_BLOCK[chainId]),
      ),

    enabled: Boolean(chainId && searchValue),
    ...QUERY_SETTINGS_IMMUTABLE,
  })
  const searchResult = useMemo(() => {
    if (data) {
      return {
        ...data,
        loading: status !== 'success',
        error,
      }
    }
    return {
      tokens: [],
      pools: [],
      loading: true,
      error,
    }
  }, [data, status, error])
  return searchResult
}
