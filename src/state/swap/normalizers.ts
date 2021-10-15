import { fromUnixTime } from 'date-fns'
import { formatAmount, formatAmoutNotation } from 'views/Info/utils/formatInfoNumbers'
import { PairDayDatasResponse, PairHoursDatasResponse } from './fetch/types'
import { PairDataNormalized, PairPricesNormalized } from './types'

const formatOptions = {
  notation: 'standard' as formatAmoutNotation,
  displayThreshold: 0.001,
  tokenPrecision: true,
}

export const normalizeFetchPairHourData = (data: PairHoursDatasResponse | null): PairDataNormalized =>
  data?.pairHourDatas?.map((fetchPairEntry) => ({
    time: fromUnixTime(fetchPairEntry.hourStartUnix),
    token0Id: fetchPairEntry.pair.token0.id,
    token1Id: fetchPairEntry.pair.token1.id,
    token0Price: formatAmount(parseFloat(fetchPairEntry.pair.token0Price), formatOptions),
    token1Price: formatAmount(parseFloat(fetchPairEntry.pair.token1Price), formatOptions),
  }))

export const normalizeFetchPairDayData = (data: PairDayDatasResponse | null): PairDataNormalized =>
  data?.pairDayDatas?.map((fetchPairEntry) => ({
    time: fromUnixTime(fetchPairEntry.date),
    token0Id: fetchPairEntry.pairAddress.token0.id,
    token1Id: fetchPairEntry.pairAddress.token1.id,
    token0Price: formatAmount(parseFloat(fetchPairEntry.pairAddress.token0Price), formatOptions),
    token1Price: formatAmount(parseFloat(fetchPairEntry.pairAddress.token1Price), formatOptions),
  }))

type normalizePairByActiveTokenParams = {
  pairPrices: PairDataNormalized
  activeToken: string
}

export const normalizePairByActiveToken = ({
  pairPrices,
  activeToken,
}: normalizePairByActiveTokenParams): PairPricesNormalized =>
  pairPrices.map((pairPrice) => ({
    time: pairPrice.time,
    value: activeToken === pairPrice?.token0Id ? pairPrice.token1Price : pairPrice.token0Price,
  }))
