import { ChainId } from '@pancakeswap/chains'
import { ChartDataTimeWindowEnum } from '@pancakeswap/uikit'
import { PriceCalculator } from '@pancakeswap/widgets-internal/roi'
import { useMemo } from 'react'
import { usePairPriceChartTokenData } from 'views/V3Info/hooks'

export const usePairTokensPrice = (
  pairAddress?: string,
  duration?: ChartDataTimeWindowEnum,
  chainId?: ChainId,
  enabled = true,
) => {
  const priceTimeWindow = useMemo(() => {
    switch (duration) {
      case ChartDataTimeWindowEnum.HOUR:
        return 'hour'
      case ChartDataTimeWindowEnum.DAY:
        return 'day'
      case ChartDataTimeWindowEnum.WEEK:
        return 'week'
      case ChartDataTimeWindowEnum.MONTH:
        return 'month'
      case ChartDataTimeWindowEnum.YEAR:
        return 'year'
      default:
        return undefined
    }
  }, [duration])

  const pairPrice = usePairPriceChartTokenData(pairAddress?.toLowerCase(), priceTimeWindow, chainId, enabled)

  const pairPriceData: { time: Date; value: number }[] = useMemo(() => {
    return (
      pairPrice?.data?.map((d) => ({
        time: new Date(d.time * 1000),
        value: d.close,
      })) || []
    )
  }, [pairPrice])

  return useMemo<PriceCalculator>(
    () => ({
      pairPriceData,
      maxPrice: pairPrice?.maxPrice,
      minPrice: pairPrice?.minPrice,
      averagePrice: pairPrice?.averagePrice,
    }),
    [pairPriceData, pairPrice],
  )
}
