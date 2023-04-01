import { ChainId } from '@pancakeswap/sdk'
import dayjs, { OpUnitType } from 'dayjs'
import { GraphQLClient } from 'graphql-request'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { multiChainName } from 'state/info/constant'
import { Block } from 'state/info/types'
import useSWRImmutable from 'swr/immutable'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import { v3Clients } from 'utils/graphql'
import { useBlocksFromTimestamps } from 'views/Info/hooks/useBlocksFromTimestamps'
import { fetchChartData } from '../data/protocol/chart'
import { fetchProtocolData } from '../data/protocol/overview'
import { fetchTopTransactions } from '../data/protocol/transactions'
import { fetchPairPriceChartTokenData, fetchTokenPriceData } from '../data/token/priceData'
import { fetchedTokenDatas } from '../data/token/tokenData'
import { fetchTokenTransactions } from '../data/token/transactions'
import { fetchPoolsForToken } from '../data/token/poolsForToken'
import { fetchTokenChartData } from '../data/token/chartData'
import { fetchTopTokenAddresses } from '../data/token/topTokens'
import { fetchPoolDatas } from '../data/pool/poolData'
import { fetchTopPoolAddresses } from '../data/pool/topPools'
import {
  ChartDayData,
  PriceChartEntry,
  ProtocolData,
  TokenData,
  Transaction,
  PoolData,
  TokenChartEntry,
} from '../types'

const ONE_HOUR_SECONDS = 3600
const SIX_HOUR_SECONDS = 21600
const ONE_DAY_SECONDS = 86400
const ONE_WEEK_SECONDS = 604800

const DURATION_INTERVAL = {
  day: ONE_HOUR_SECONDS,
  week: SIX_HOUR_SECONDS,
  month: ONE_DAY_SECONDS,
  year: ONE_WEEK_SECONDS,
}

const SWR_SETTINGS_WITHOUT_REFETCH = {
  errorRetryCount: 3,
  errorRetryInterval: 3000,
}

export const useProtocolChartData = (): ChartDayData[] | undefined => {
  const { chainId } = useActiveChainId()
  const { data: chartData } = useSWRImmutable(
    chainId && [`v3/info/protocol/ProtocolChartData`, chainId],
    () => fetchChartData(v3Clients[chainId]),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return chartData?.data ?? []
}

export const useProtocolData = (): ProtocolData | undefined => {
  const { chainId } = useActiveChainId()
  const [t24, t48] = getDeltaTimestamps()
  const { blocks } = useBlocksFromTimestamps([t24, t48])
  const { data } = useSWRImmutable(
    chainId && blocks && blocks.length > 0 && [`v3/info/protocol/ProtocolData`, chainId],
    () => fetchProtocolData(v3Clients[chainId], chainId, blocks),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.data ?? undefined
}

export const useProtocolTransactionData = (): Transaction[] | undefined => {
  const { chainId } = useActiveChainId()
  const { data } = useSWRImmutable(
    chainId && [`v3/info/protocol/ProtocolTransactionData`, chainId],
    () => fetchTopTransactions(v3Clients[chainId]),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data ?? []
}

export const useTokenPriceChartData = (
  address: string,
  duration?: 'day' | 'week' | 'month' | 'year',
  targetChianId?: ChainId,
): PriceChartEntry[] | undefined => {
  const { chainId } = useActiveChainId()
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
        v3Clients[targetChianId ?? chainId],
        multiChainName[targetChianId ?? chainId],
      ),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.data ?? []
}

// this is for the swap page and ROI calculator
export const usePairPriceChartTokenData = (
  address?: string,
  duration?: 'day' | 'week' | 'month' | 'year',
  targetChianId?: ChainId,
): PriceChartEntry[] | undefined => {
  const { chainId } = useActiveChainId()
  const utcCurrentTime = dayjs()
  const startTimestamp = utcCurrentTime
    .subtract(1, duration ?? 'day')
    .startOf('hour')
    .unix()

  const { data } = useSWRImmutable(
    chainId && address && [`v3/info/token/pairPriceChartToken/${address}/${duration}`, targetChianId ?? chainId],
    () =>
      fetchPairPriceChartTokenData(
        address,
        DURATION_INTERVAL[duration ?? 'day'],
        startTimestamp,
        v3Clients[targetChianId ?? chainId],
        multiChainName[targetChianId ?? chainId],
      ),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.data ?? []
}

export async function fetchTopTokens(dataClient: GraphQLClient, blocks: Block[]) {
  try {
    const topTokenAddress = await fetchTopTokenAddresses(dataClient)
    const data = await fetchedTokenDatas(dataClient, topTokenAddress.addresses, blocks)
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
  const { chainId } = useActiveChainId()
  const [t24, t48, t7d] = getDeltaTimestamps()
  const { blocks } = useBlocksFromTimestamps([t24, t48, t7d])

  const { data } = useSWRImmutable(
    chainId && blocks && blocks.length > 0 && [`v3/info/token/TopTokensData/${chainId}`, chainId],
    () => fetchTopTokens(v3Clients[chainId], blocks),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.data
}

export const useTokenData = (address: string): TokenData | undefined => {
  const { chainId } = useActiveChainId()
  const [t24, t48, t7d] = getDeltaTimestamps()
  const { blocks } = useBlocksFromTimestamps([t24, t48, t7d])

  const { data } = useSWRImmutable(
    chainId && blocks && address && blocks.length > 0 && [`v3/info/token/tokenData/${chainId}/${address}`, chainId],
    () => fetchedTokenDatas(v3Clients[chainId], [address], blocks),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.data?.[address]
}

export const usePoolsForToken = (address: string): string[] | undefined => {
  const { chainId } = useActiveChainId()
  const { data } = useSWRImmutable(
    chainId && address && [`v3/info/token/poolsForTOken/${chainId}/${address}`, chainId],
    () => fetchPoolsForToken(address, v3Clients[chainId]),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.addresses
}

export const useTokenChartData = (address: string): TokenChartEntry[] | undefined => {
  const { chainId } = useActiveChainId()

  const { data } = useSWRImmutable(
    chainId && address && [`v3/info/token/tokenChartData/${chainId}/${address}`, chainId],
    () => fetchTokenChartData(address, v3Clients[chainId]),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.data
}

export const useTokenPriceData = (
  address: string,
  interval: number,
  timeWindow: OpUnitType,
): PriceChartEntry[] | undefined => {
  const { chainId } = useActiveChainId()
  const utcCurrentTime = dayjs()
  const startTimestamp = utcCurrentTime
    .subtract(1, timeWindow ?? 'day')
    .startOf('hour')
    .unix()

  const { data } = useSWRImmutable(
    chainId && address && [`v3/info/token/tokenPriceData/${chainId}/${address}/${interval}/${timeWindow}`, chainId],
    () => fetchTokenPriceData(address, interval, startTimestamp, v3Clients[chainId], multiChainName[chainId]),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.data
}

export const useTokenTransactions = (address: string): Transaction[] | undefined => {
  const { chainId } = useActiveChainId()
  const { data } = useSWRImmutable(
    chainId && address && [`v3/info/token/tokenTransaction/${chainId}/${address}`, chainId],
    () => fetchTokenTransactions(address, v3Clients[chainId]),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.data
}

export async function fetchTopPools(dataClient: GraphQLClient, chainId: ChainId, blocks: Block[]) {
  try {
    const topPoolAddress = await fetchTopPoolAddresses(dataClient, chainId)
    const data = await fetchPoolDatas(dataClient, topPoolAddress.addresses, blocks)
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
  const { chainId } = useActiveChainId()
  const [t24, t48, t7d] = getDeltaTimestamps()
  const { blocks } = useBlocksFromTimestamps([t24, t48, t7d])

  const { data } = useSWRImmutable(
    chainId && blocks && blocks.length > 0 && [`v3/info/pool/TopPoolsData/${chainId}`, chainId],
    () => fetchTopPools(v3Clients[chainId], chainId, blocks),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.data
}

export const usePoolsData = (addresses: string[]): PoolData[] | undefined => {
  const { chainId } = useActiveChainId()
  const [t24, t48, t7d] = getDeltaTimestamps()
  const { blocks } = useBlocksFromTimestamps([t24, t48, t7d])

  const { data } = useSWRImmutable(
    chainId &&
      blocks &&
      blocks.length > 0 &&
      addresses &&
      addresses.length > 0 && [`v3/info/pool/poolsData/${chainId}/${addresses.join()}`, chainId],
    () => fetchPoolDatas(v3Clients[chainId], addresses, blocks),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return data?.data ? Object.values(data.data) : undefined
}
