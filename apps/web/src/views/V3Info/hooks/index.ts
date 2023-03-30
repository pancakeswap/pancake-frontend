import { ChainId } from '@pancakeswap/sdk'
import dayjs from 'dayjs'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { multiChainName } from 'state/info/constant'
import useSWRImmutable from 'swr/immutable'
import { v3Clients } from 'utils/graphql'
import { fetchChartData } from '../data/protocol/chart'
import { fetchTopTransactions } from '../data/protocol/transactions'
import { fetchTokenPriceData, fetchPairPriceChartTokenData } from '../data/token/priceData'
import { ChartDayData, PriceChartEntry, Transaction } from '../types'

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
