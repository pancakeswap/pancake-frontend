/* eslint-disable no-await-in-loop */
import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { ChartEntry } from 'state/info/types'
import { MultiChainName, getMultiChainQueryEndPointWithStableSwap, multiChainStartTime } from '../../constant'
import { useGetChainName } from '../../hooks'
import { fetchChartData, mapDayData } from '../helpers'
import { BetterXDayDatasResponse } from '../types'

/**
 * Data for displaying Liquidity and Volume charts on Overview page
 */
const BETTERX_DAY_DATAS = gql`
  query overviewCharts($startTime: Int!, $skip: Int!) {
    betterXDayDatas(first: 1000, skip: $skip, where: { date_gt: $startTime }, orderBy: date, orderDirection: asc) {
      date
      dailyVolumeUSD
      totalLiquidityUSD
    }
  }
`

const getOverviewChartData = async (
  chainName: MultiChainName,
  skip: number,
): Promise<{ data?: ChartEntry[]; error: boolean }> => {
  try {
    const { betterXDayDatas } = await getMultiChainQueryEndPointWithStableSwap(
      chainName,
    ).request<BetterXDayDatasResponse>(BETTERX_DAY_DATAS, {
      startTime: multiChainStartTime[chainName],
      skip,
    })
    const data = betterXDayDatas.map(mapDayData)
    return { data, error: false }
  } catch (error) {
    console.error('Failed to fetch overview chart data', error)
    return { error: true }
  }
}

/**
 * Fetch historic chart data
 */
const useFetchGlobalChartData = (): {
  error: boolean
  data: ChartEntry[] | undefined
} => {
  const [overviewChartData, setOverviewChartData] = useState<ChartEntry[] | undefined>()
  const [error, setError] = useState(false)
  const chainName = useGetChainName()

  useEffect(() => {
    const fetch = async () => {
      if (!chainName) return

      const { data } = await fetchChartData(chainName, getOverviewChartData)
      if (data) {
        setOverviewChartData(data)
      } else {
        setError(true)
      }
    }
    if (!overviewChartData && !error) {
      fetch()
    }
  }, [overviewChartData, error, chainName])

  return {
    error,
    data: overviewChartData,
  }
}

export const fetchGlobalChartData = async (chainName: MultiChainName) => {
  const { data } = await fetchChartData(chainName, getOverviewChartData)
  return data
}

export default useFetchGlobalChartData
