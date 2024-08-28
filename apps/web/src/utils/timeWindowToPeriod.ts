import { ChartDataTimeWindowEnum } from '@pancakeswap/uikit'
import { ChartPeriod } from 'state/info/api/client'

export const timeWindowToPeriod = (timeWindow: ChartDataTimeWindowEnum): ChartPeriod => {
  switch (timeWindow) {
    case ChartDataTimeWindowEnum.HOUR:
      return '1H'
    case ChartDataTimeWindowEnum.DAY:
      return '1D'
    case ChartDataTimeWindowEnum.WEEK:
      return '1W'
    case ChartDataTimeWindowEnum.MONTH:
      return '1M'
    case ChartDataTimeWindowEnum.YEAR:
      return '1Y'
    default:
      throw new Error('Invalid time window')
  }
}
