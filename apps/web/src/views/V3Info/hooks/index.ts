import { ChainId } from '@pancakeswap/sdk'
import { FetchStatus } from 'config/constants/types'
import dayjs, { ManipulateType } from 'dayjs'
import { GraphQLClient } from 'graphql-request'
import { useMemo } from 'react'
import { useChainNameByQuery } from 'state/info/hooks'
import { multiChainName, multiChainId } from 'state/info/constant'
import { Block } from 'state/info/types'
import useSWRImmutable from 'swr/immutable'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import { v3InfoClients, v3Clients } from 'utils/graphql'
import { useBlockFromTimeStampSWR } from 'views/Info/hooks/useBlocksFromTimestamps'
import { SUBGRAPH_START_BLOCK, DURATION_INTERVAL } from '../constants'
import { fetchPoolChartData } from '../data/pool/chartData'
import { fetchPoolDatas } from '../data/pool/poolData'
import { PoolTickData, fetchTicksSurroundingPrice } from '../data/pool/tickData'
import { fetchTopPoolAddresses } from '../data/pool/topPools'
import { fetchPoolTransactions } from '../data/pool/transactions'
import { fetchChartData } from '../data/protocol/chart'
import { fetchProtocolData } from '../data/protocol/overview'
import { fetchTopTransactions } from '../data/protocol/transactions'
import { fetchSearchResults } from '../data/search'
import { fetchTokenChartData } from '../data/token/chartData'
import { fetchPoolsForToken } from '../data/token/poolsForToken'
import { fetchPairPriceChartTokenData, fetchTokenPriceData } from '../data/token/priceData'
import { fetchedTokenDatas } from '../data/token/tokenData'
import { fetchTopTokenAddresses } from '../data/token/topTokens'
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

const SWR_SETTINGS_WITHOUT_REFETCH = {
  errorRetryCount: 3,
  errorRetryInterval: 3000,
  keepPreviousData: true,
}

export const useProtocolChartData = (): ChartDayData[] | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]
  const { data: chartData } = useSWRImmutable(
    chainId && [`v3/info/protocol/ProtocolChartData/${chainId}`, chainId],
    () => fetchChartData(v3InfoClients[chainId]),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return chartData?.data ?? []
}

export const useProtocolData = (): ProtocolData | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]
  const [t24, t48] = getDeltaTimestamps()
  const { blocks } = useBlockFromTimeStampSWR([t24, t48])
  const { data } = useSWRImmutable(
    chainId && blocks && blocks.length > 0 && [`v3/info/protocol/ProtocolData/${chainId}`, chainId],
    () => fetchProtocolData(v3InfoClients[chainId], blocks),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.data ?? undefined
}

export const useProtocolTransactionData = (): Transaction[] | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]
  const { data } = useSWRImmutable(
    chainId && [`v3/info/protocol/ProtocolTransactionData/${chainId}`, chainId],
    () => fetchTopTransactions(v3InfoClients[chainId]),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.filter((d) => d.amountUSD > 0) ?? []
}

export const useTokenPriceChartData = (
  address: string,
  duration?: 'day' | 'week' | 'month' | 'year',
  targetChianId?: ChainId,
): PriceChartEntry[] | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]
  const utcCurrentTime = dayjs()
  const startTimestamp = utcCurrentTime
    .subtract(1, duration ?? 'day')
    .startOf('hour')
    .unix()

  const { data } = useSWRImmutable(
    chainId && address && [`v3/info/token/priceData/${address}/${duration}`, targetChianId ?? chainId],
    () =>
      fetchTokenPriceData(
        address,
        DURATION_INTERVAL[duration ?? 'day'],
        startTimestamp,
        v3InfoClients[targetChianId ?? chainId],
        multiChainName[targetChianId ?? chainId],
        SUBGRAPH_START_BLOCK[chainId],
      ),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.data ?? []
}

// this is for the swap page and ROI calculator
export const usePairPriceChartTokenData = (
  address: string,
  duration?: 'day' | 'week' | 'month' | 'year',
  targetChianId?: ChainId,
): { data: PriceChartEntry[] | undefined; maxPrice?: number; minPrice?: number; averagePrice?: number } => {
  const chainName = useChainNameByQuery()
  const chainId = targetChianId || multiChainId[chainName]
  const utcCurrentTime = dayjs()
  const startTimestamp = utcCurrentTime
    .subtract(1, duration ?? 'day')
    .startOf('hour')
    .unix()

  const { data } = useSWRImmutable(
    chainId &&
      address &&
      address !== 'undefined' && [`v3/info/token/pairPriceChartToken/${address}/${duration}`, targetChianId ?? chainId],
    () =>
      fetchPairPriceChartTokenData(
        address,
        DURATION_INTERVAL[duration ?? 'day'],
        startTimestamp,
        v3Clients[targetChianId ?? chainId],
        multiChainName[targetChianId ?? chainId],
        SUBGRAPH_START_BLOCK[chainId],
      ),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return {
    data: data?.data ?? [],
    maxPrice: data?.maxPrice,
    minPrice: data?.minPrice,
    averagePrice: data?.averagePrice,
  }
}

export async function fetchTopTokens(dataClient: GraphQLClient, blocks: Block[]) {
  try {
    const topTokenAddress = await fetchTopTokenAddresses(dataClient)
    const data = await fetchedTokenDatas(dataClient, topTokenAddress.addresses ?? [], blocks)
    return data
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
  const [t24, t48, t7d] = getDeltaTimestamps()
  const { blocks } = useBlockFromTimeStampSWR([t24, t48, t7d])

  const { data } = useSWRImmutable(
    chainId && blocks && blocks.length > 0 && [`v3/info/token/TopTokensData/${chainId}`, chainId],
    () =>
      fetchTopTokens(
        v3InfoClients[chainId],
        blocks.filter((d) => d.number >= SUBGRAPH_START_BLOCK[chainId]),
      ),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.data
}

export const useTokensData = (addresses: string[]): TokenData[] | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]
  const [t24, t48, t7d] = getDeltaTimestamps()
  const { blocks } = useBlockFromTimeStampSWR([t24, t48, t7d])

  const { data } = useSWRImmutable(
    chainId &&
      blocks &&
      addresses &&
      addresses?.length > 0 &&
      blocks?.length > 0 && [`v3/info/token/tokensData/${chainId}/${addresses.join()}`, chainId],
    () =>
      fetchedTokenDatas(
        v3InfoClients[chainId],
        addresses,
        blocks.filter((d) => d.number >= SUBGRAPH_START_BLOCK[chainId]),
      ),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.data ? Object.values(data?.data) : undefined
}

export const useTokenData = (address: string): TokenData | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]
  const [t24, t48, t7d] = getDeltaTimestamps()
  const { blocks } = useBlockFromTimeStampSWR([t24, t48, t7d])

  const { data } = useSWRImmutable(
    chainId &&
      blocks &&
      address &&
      address !== 'undefined' &&
      blocks?.length > 0 && [`v3/info/token/tokenData/${chainId}/${address}`, chainId],
    () =>
      fetchedTokenDatas(
        v3InfoClients[chainId],
        [address],
        blocks.filter((d) => d.number >= SUBGRAPH_START_BLOCK[chainId]),
      ),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.data?.[address]
}

export const usePoolsForToken = (address: string): string[] | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]
  const { data } = useSWRImmutable(
    chainId && address && [`v3/info/token/poolsForTOken/${chainId}/${address}`, chainId],
    () => fetchPoolsForToken(address, v3InfoClients[chainId]),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.addresses
}

export const useTokenChartData = (address: string): TokenChartEntry[] | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]

  const { data } = useSWRImmutable(
    chainId && address && [`v3/info/token/tokenChartData/${chainId}/${address}`, chainId],
    () => fetchTokenChartData(address, v3InfoClients[chainId]),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.data
}

export const useTokenPriceData = (
  address: string,
  interval: number,
  timeWindow: ManipulateType,
): PriceChartEntry[] | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]
  const utcCurrentTime = dayjs()
  const startTimestamp = utcCurrentTime
    .subtract(1, timeWindow ?? 'day')
    .startOf('hour')
    .unix()

  const { data } = useSWRImmutable(
    chainId && address && [`v3/info/token/tokenPriceData/${chainId}/${address}/${interval}/${timeWindow}`, chainId],
    () =>
      fetchTokenPriceData(
        address,
        interval,
        startTimestamp,
        v3InfoClients[chainId],
        multiChainName[chainId],
        SUBGRAPH_START_BLOCK[chainId],
      ),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.data
}

export const useTokenTransactions = (address: string): Transaction[] | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]
  const { data } = useSWRImmutable(
    chainId && address && [`v3/info/token/tokenTransaction/${chainId}/${address}`, chainId],
    () => fetchTokenTransactions(address, v3InfoClients[chainId]),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.data?.filter((d) => d.amountUSD > 0)
}

export async function fetchTopPools(dataClient: GraphQLClient, chainId: ChainId, blocks: Block[]) {
  try {
    const topPoolAddress = await fetchTopPoolAddresses(dataClient, chainId)
    const data = await fetchPoolDatas(dataClient, topPoolAddress.addresses ?? [], blocks)
    return data
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
  const [t24, t48, t7d] = getDeltaTimestamps()
  const { blocks } = useBlockFromTimeStampSWR([t24, t48, t7d])

  const { data } = useSWRImmutable(
    chainId && blocks && blocks.length > 0 && [`v3/info/pool/TopPoolsData/${chainId}`, chainId],
    () =>
      fetchTopPools(
        v3InfoClients[chainId],
        chainId,
        blocks.filter((d) => d.number >= SUBGRAPH_START_BLOCK[chainId]),
      ),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.data
}

export const usePoolsData = (addresses: string[]): PoolData[] | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]
  const [t24, t48, t7d] = getDeltaTimestamps()
  const { blocks } = useBlockFromTimeStampSWR([t24, t48, t7d])

  const { data } = useSWRImmutable(
    chainId &&
      blocks &&
      blocks?.length > 0 &&
      addresses &&
      addresses?.length > 0 && [`v3/info/pool/poolsData/${chainId}/${addresses.join()}`, chainId],
    () =>
      fetchPoolDatas(
        v3InfoClients[chainId],
        addresses,
        blocks.filter((d) => d.number >= SUBGRAPH_START_BLOCK[chainId]),
      ),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.data ? Object.values(data.data) : undefined
}

export const usePoolData = (address: string): PoolData | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]
  const [t24, t48, t7d] = getDeltaTimestamps()
  const { blocks } = useBlockFromTimeStampSWR([t24, t48, t7d])

  const { data } = useSWRImmutable(
    chainId &&
      blocks &&
      blocks?.length > 0 &&
      address &&
      address !== 'undefined' && [`v3/info/pool/poolData/${chainId}/${address}`, chainId],
    () =>
      fetchPoolDatas(
        v3InfoClients[chainId],
        [address],
        blocks.filter((d) => d.number >= SUBGRAPH_START_BLOCK[chainId]),
      ),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.data?.[address] ?? undefined
}
export const usePoolTransactions = (address: string): Transaction[] | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]

  const { data } = useSWRImmutable(
    chainId && address && [`v3/info/pool/poolTransaction/${chainId}/${address}`, chainId],
    () => fetchPoolTransactions(address, v3InfoClients[chainId]),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.data?.filter((d) => d.amountUSD > 0) ?? undefined
}

export const usePoolChartData = (address: string): PoolChartEntry[] | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]
  const { data } = useSWRImmutable(
    chainId && address && address !== 'undefined' && [`v3/info/pool/poolChartData/${chainId}/${address}`, chainId],
    () => fetchPoolChartData(address, v3InfoClients[chainId]),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.data
}

export const usePoolTickData = (address: string): PoolTickData | undefined => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]

  const { data } = useSWRImmutable(
    chainId && address && [`v3/info/pool/poolTickData/${chainId}/${address}`, chainId],
    () => fetchTicksSurroundingPrice(address, v3InfoClients[chainId], chainId),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.data ?? undefined
}

export const useSearchData = (
  searchValue: string,
): { tokens: TokenData[]; pools: PoolData[]; loading: boolean; error: any } => {
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]
  const [t24, t48, t7d] = getDeltaTimestamps()
  const { blocks } = useBlockFromTimeStampSWR([t24, t48, t7d])
  const { data, status, error } = useSWRImmutable(
    chainId && searchValue && [`v3/info/pool/searchData/${chainId}/${searchValue}`, chainId],
    () =>
      fetchSearchResults(
        v3InfoClients[chainId],
        searchValue,
        blocks.filter((d) => d.number >= SUBGRAPH_START_BLOCK[chainId]),
      ),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  const searchResult = useMemo(() => {
    if (data)
      return {
        ...data,
        loading: status !== FetchStatus.Fetched,
        error,
      }
    return {
      tokens: [],
      pools: [],
      loading: status !== FetchStatus.Fetched,
      error,
    }
  }, [data, status, error])
  return searchResult
}
