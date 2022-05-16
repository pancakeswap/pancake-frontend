import times from 'lodash/times'
import { PairDataTimeWindowEnum } from '../types'
import { timeWindowGapMapping } from './constants'
import { PairDayDatasResponse, PairHoursDatasResponse } from './types'

type getPairSequentialIdParams = {
  id: string
  pairId: string
}
export const getPairSequentialId = ({ id, pairId }: getPairSequentialIdParams) => id.replace(`${pairId}-`, '')

type getPairHoursIdsByTimeWindowParams = {
  pairAddress: string
  pairLastId: string
  timeWindow: PairDataTimeWindowEnum
  idsCount: number
}

export const getIdsByTimeWindow = ({
  pairAddress,
  pairLastId,
  timeWindow,
  idsCount,
}: getPairHoursIdsByTimeWindowParams) => {
  const pairLastIdAsNumber = Number(pairLastId)
  if (timeWindow === PairDataTimeWindowEnum.DAY) {
    return []
  }
  return times(idsCount, (value) => `${pairAddress}-${pairLastIdAsNumber - value * timeWindowGapMapping[timeWindow]}`)
}

export const pairHasEnoughLiquidity = (
  data: PairHoursDatasResponse | PairDayDatasResponse | null,
  timeWindow: PairDataTimeWindowEnum,
) => {
  const liquidityThreshold = 10000
  switch (timeWindow) {
    case PairDataTimeWindowEnum.DAY:
    case PairDataTimeWindowEnum.WEEK: {
      const amountOfDataPoints = (data as PairHoursDatasResponse)?.pairHourDatas?.length ?? 1
      const totalUSD = (data as PairHoursDatasResponse)?.pairHourDatas?.reduce((totalLiquidity, fetchPairEntry) => {
        return totalLiquidity + parseFloat(fetchPairEntry.reserveUSD)
      }, 0)
      return totalUSD / amountOfDataPoints > liquidityThreshold
    }
    case PairDataTimeWindowEnum.MONTH:
    case PairDataTimeWindowEnum.YEAR: {
      const amountOfDataPoints = (data as PairDayDatasResponse)?.pairDayDatas?.length ?? 1
      const totalUSD = (data as PairDayDatasResponse)?.pairDayDatas?.reduce((totalLiquidity, fetchPairEntry) => {
        return totalLiquidity + parseFloat(fetchPairEntry.reserveUSD)
      }, 0)
      return totalUSD / amountOfDataPoints > liquidityThreshold
    }
    default:
      return null
  }
}
