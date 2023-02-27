import { fromUnixTime } from 'date-fns'
import fromPairs from 'lodash/fromPairs'
import { PairDayDatasResponse, PairHoursDatasResponse } from './fetch/types'
import { DerivedPairDataNormalized, PairDataNormalized, PairDataTimeWindowEnum, PairPricesNormalized } from './types'

export const normalizeChartData = (
  data: PairHoursDatasResponse | PairDayDatasResponse | null,
  token0Address: string,
  token1Address: string,
  timeWindow: PairDataTimeWindowEnum,
) => {
  switch (timeWindow) {
    case PairDataTimeWindowEnum.DAY:
    case PairDataTimeWindowEnum.WEEK:
      return (data as PairHoursDatasResponse)?.pairHourDatas?.map((fetchPairEntry) => ({
        time: fetchPairEntry.hourStartUnix,
        token0Id: token0Address,
        token1Id: token1Address,
        reserve0: parseFloat(fetchPairEntry.reserve0),
        reserve1: parseFloat(fetchPairEntry.reserve1),
      }))
    case PairDataTimeWindowEnum.MONTH:
    case PairDataTimeWindowEnum.YEAR:
      return (data as PairDayDatasResponse)?.pairDayDatas?.map((fetchPairEntry) => ({
        time: fetchPairEntry.date,
        token0Id: token0Address,
        token1Id: token1Address,
        reserve0: parseFloat(fetchPairEntry.reserve0),
        reserve1: parseFloat(fetchPairEntry.reserve1),
      }))
    default:
      return null
  }
}

export const normalizeDerivedChartData = (data: any) => {
  if (!data?.token0DerivedUSD || data?.token0DerivedUSD.length === 0) {
    return []
  }

  const token1DerivedUSDEntryMap: any = fromPairs(
    data?.token1DerivedUSD?.map((entry) => [entry.timestamp, entry]) ?? [],
  )

  return data?.token0DerivedUSD.reduce((acc, token0DerivedUSDEntry) => {
    const token1DerivedUSDEntry = token1DerivedUSDEntryMap[token0DerivedUSDEntry.timestamp]
    if (token1DerivedUSDEntry) {
      acc.push({
        time: parseInt(token0DerivedUSDEntry.timestamp, 10),
        token0Id: token0DerivedUSDEntry.tokenAddress,
        token1Id: token1DerivedUSDEntry.tokenAddress,
        token0DerivedUSD: token0DerivedUSDEntry.derivedUSD,
        token1DerivedUSD: token1DerivedUSDEntry.derivedUSD,
      })
    }
    return acc
  }, [])
}

type normalizePairDataByActiveTokenParams = {
  pairData: PairDataNormalized
  activeToken: string
}

export const normalizePairDataByActiveToken = ({
  pairData,
  activeToken,
}: normalizePairDataByActiveTokenParams): PairPricesNormalized =>
  pairData
    ?.map((pairPrice) => ({
      time: fromUnixTime(pairPrice.time),
      value:
        activeToken === pairPrice?.token0Id
          ? pairPrice.reserve1 / pairPrice.reserve0
          : pairPrice.reserve0 / pairPrice.reserve1,
    }))
    .reverse()

type normalizeDerivedPairDataByActiveTokenParams = {
  pairData: DerivedPairDataNormalized
  activeToken: string
}

export const normalizeDerivedPairDataByActiveToken = ({
  pairData,
  activeToken,
}: normalizeDerivedPairDataByActiveTokenParams): PairPricesNormalized =>
  pairData?.map((pairPrice) => ({
    time: fromUnixTime(pairPrice.time),
    value:
      activeToken === pairPrice?.token0Id
        ? pairPrice.token0DerivedUSD / pairPrice.token1DerivedUSD
        : pairPrice.token1DerivedUSD / pairPrice.token0DerivedUSD,
  }))
