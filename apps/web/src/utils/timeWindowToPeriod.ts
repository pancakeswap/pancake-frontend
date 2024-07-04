import { PairDataTimeWindowEnum } from '@pancakeswap/uikit'
import { ChartPeriod } from 'state/info/api/client'

export const timeWindowToPeriod = (timeWindow: PairDataTimeWindowEnum): ChartPeriod => {
  switch (timeWindow) {
    case PairDataTimeWindowEnum.HOUR:
      return '1H'
    case PairDataTimeWindowEnum.DAY:
      return '1D'
    case PairDataTimeWindowEnum.WEEK:
      return '1W'
    case PairDataTimeWindowEnum.MONTH:
      return '1M'
    case PairDataTimeWindowEnum.YEAR:
      return '1Y'
    default:
      throw new Error('Invalid time window')
  }
}
