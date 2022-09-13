import { fromUnixTime } from 'date-fns'
import fromPairs from 'lodash/fromPairs'
import { PairDayDatasResponse, PairHoursDatasResponse } from './fetch/types'
import { DerivedPairDataNormalized, PairDataNormalized, PairDataTimeWindowEnum, PairPricesNormalized } from './types'

export const normalizeChartData = (
  data: PairHoursDatasResponse | PairDayDatasResponse | null,
  timeWindow: PairDataTimeWindowEnum,
) => {
  switch (timeWindow) {
    case PairDataTimeWindowEnum.DAY:
    case PairDataTimeWindowEnum.WEEK:
      return (data as PairHoursDatasResponse)?.pairHourDatas?.map((fetchPairEntry) => ({
        time: fetchPairEntry.hourStartUnix,
        token0Id: fetchPairEntry.pair.token0.id,
        token1Id: fetchPairEntry.pair.token1.id,
        reserve0: parseFloat(fetchPairEntry.reserve0),
        reserve1: parseFloat(fetchPairEntry.reserve1),
      }))
    case PairDataTimeWindowEnum.MONTH:
    case PairDataTimeWindowEnum.YEAR:
      return (data as PairDayDatasResponse)?.pairDayDatas?.map((fetchPairEntry) => ({
        time: fetchPairEntry.date,
        token0Id: fetchPairEntry.pairAddress.token0.id,
        token1Id: fetchPairEntry.pairAddress.token1.id,
        reserve0: parseFloat(fetchPairEntry.reserve0),
        reserve1: parseFloat(fetchPairEntry.reserve1),
      }))
    default:
      return null
  }
}

export const normalizeDerivedChartData = (data: any) => {
  if (!data?.token0DerivedBnb || data?.token0DerivedBnb.length === 0) {
    return []
  }

  const token1DerivedBnbEntryMap: any = fromPairs(
    data?.token1DerivedBnb?.map((entry) => [entry.timestamp, entry]) ?? [],
  )

  return data?.token0DerivedBnb.reduce((acc, token0DerivedBnbEntry) => {
    const token1DerivedBnbEntry = token1DerivedBnbEntryMap[token0DerivedBnbEntry.timestamp]
    if (token1DerivedBnbEntry) {
      acc.push({
        time: parseInt(token0DerivedBnbEntry.timestamp, 10),
        token0Id: token0DerivedBnbEntry.tokenAddress,
        token1Id: token1DerivedBnbEntry.tokenAddress,
        token0DerivedBNB: token0DerivedBnbEntry.derivedBNB,
        token1DerivedBNB: token1DerivedBnbEntry.derivedBNB,
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
        ? pairPrice.token0DerivedBNB / pairPrice.token1DerivedBNB
        : pairPrice.token1DerivedBNB / pairPrice.token0DerivedBNB,
  }))
