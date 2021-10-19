import { fromUnixTime } from 'date-fns'
import { PairDayDatasResponse, PairHoursDatasResponse } from './fetch/types'
import { PairDataNormalized, PairPricesNormalized } from './types'

export const normalizeFetchPairHourData = (data: PairHoursDatasResponse | null): PairDataNormalized =>
  data?.pairHourDatas?.map((fetchPairEntry) => ({
    time: fetchPairEntry.hourStartUnix,
    token0Id: fetchPairEntry.pair.token0.id,
    token1Id: fetchPairEntry.pair.token1.id,
    reserve0: parseFloat(fetchPairEntry.reserve0),
    reserve1: parseFloat(fetchPairEntry.reserve1),
  }))

export const normalizeFetchPairDayData = (data: PairDayDatasResponse | null): PairDataNormalized =>
  data?.pairDayDatas?.map((fetchPairEntry) => ({
    time: fetchPairEntry.date,
    token0Id: fetchPairEntry.pairAddress.token0.id,
    token1Id: fetchPairEntry.pairAddress.token1.id,
    reserve0: parseFloat(fetchPairEntry.reserve0),
    reserve1: parseFloat(fetchPairEntry.reserve1),
  }))

type normalizePairDataByActiveTokenParams = {
  pairData: PairDataNormalized
  activeToken: string
}

export const normalizePairDataByActiveToken = ({
  pairData,
  activeToken,
}: normalizePairDataByActiveTokenParams): PairPricesNormalized =>
  pairData
    .map((pairPrice) => ({
      time: fromUnixTime(pairPrice.time),
      value:
        activeToken === pairPrice?.token0Id
          ? pairPrice.reserve1 / pairPrice.reserve0
          : pairPrice.reserve0 / pairPrice.reserve1,
    }))
    .reverse()
