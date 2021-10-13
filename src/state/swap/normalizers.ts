import { fromUnixTime } from 'date-fns'
import { formatAmount } from 'views/Info/utils/formatInfoNumbers'
import { FetchPairHoursDataResponse } from './queries/types'
import { PairHoursNormalized } from './types'

export const normalizeFetchPairHourData = (data: FetchPairHoursDataResponse): PairHoursNormalized =>
  data?.pairHourDatas?.map((fetchPairEntry) => ({
    time: fromUnixTime(fetchPairEntry.hourStartUnix),
    value: formatAmount(parseFloat(fetchPairEntry.pair.token1Price), {
      notation: 'standard',
      displayThreshold: 0.001,
      tokenPrecision: true,
    }),
  }))
