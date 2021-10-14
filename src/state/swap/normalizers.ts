import { fromUnixTime } from 'date-fns'
import { formatAmount } from 'views/Info/utils/formatInfoNumbers'
import { PairDayDatasResponse, PairHoursDatasResponse } from './fetch/types'
import { PairPricesNormalized } from './types'

export const normalizeFetchPairHourData = (data: PairHoursDatasResponse | null): PairPricesNormalized =>
  data?.pairHourDatas?.map((fetchPairEntry) => ({
    time: fromUnixTime(fetchPairEntry.hourStartUnix),
    value: formatAmount(parseFloat(fetchPairEntry.pair.token1Price), {
      notation: 'standard',
      displayThreshold: 0.001,
      tokenPrecision: true,
    }),
  }))

export const normalizeFetchPairDayData = (data: PairDayDatasResponse | null): PairPricesNormalized =>
  data?.pairDayDatas?.map((fetchPairEntry) => ({
    time: fromUnixTime(fetchPairEntry.date),
    value: formatAmount(parseFloat(fetchPairEntry.pairAddress.token1Price), {
      notation: 'standard',
      displayThreshold: 0.001,
      tokenPrecision: true,
    }),
  }))
