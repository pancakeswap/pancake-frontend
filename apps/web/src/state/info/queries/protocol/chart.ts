/* eslint-disable no-await-in-loop */
import { PCS_V2_START } from 'config/constants/info'
import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { ChartEntry } from 'state/info/types'
import { infoClient } from 'utils/graphql'
import { fetchChartData, mapDayData } from '../helpers'
import { PancakeDayDatasResponse } from '../types'

/**
 * Data for displaying Liquidity and Volume charts on Overview page
 */
const PANCAKE_DAY_DATAS = gql`
  query overviewCharts($startTime: Int!, $skip: Int!) {
    pancakeDayDatas(first: 1000, skip: $skip, where: { date_gt: $startTime }, orderBy: date, orderDirection: asc) {
      date
      dailyVolumeUSD
      totalLiquidityUSD
    }
  }
`

const getOverviewChartData = async (skip: number): Promise<{ data?: ChartEntry[]; error: boolean }> => {
  try {
    const { pancakeDayDatas } = await infoClient.request<PancakeDayDatasResponse>(PANCAKE_DAY_DATAS, {
      startTime: PCS_V2_START,
      skip,
    })
    const data = pancakeDayDatas.map(mapDayData)
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

  useEffect(() => {
    const fetch = async () => {
      const { data } = await fetchChartData(getOverviewChartData)
      if (data) {
        setOverviewChartData(data)
      } else {
        setError(true)
      }
    }
    if (!overviewChartData && !error) {
      fetch()
    }
  }, [overviewChartData, error])

  return {
    error,
    data: overviewChartData,
  }
}

export default useFetchGlobalChartData
