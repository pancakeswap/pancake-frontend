import { ChainId } from '@pancakeswap/chains'
import { PairDataTimeWindowEnum } from '@pancakeswap/uikit'
import { PriceCalculator } from '@pancakeswap/widgets-internal/roi'
import { useMemo } from 'react'
import { usePairPriceChartTokenData } from 'views/V3Info/hooks'

export const usePairTokensPrice = (
  pairAddress?: string,
  duration?: PairDataTimeWindowEnum,
  chainId?: ChainId,
  enabled = true,
) => {
  const priceTimeWindow = useMemo(() => {
    switch (duration) {
      case PairDataTimeWindowEnum.HOUR:
        return 'hour'
      case PairDataTimeWindowEnum.DAY:
        return 'day'
      case PairDataTimeWindowEnum.WEEK:
        return 'week'
      case PairDataTimeWindowEnum.MONTH:
        return 'month'
      case PairDataTimeWindowEnum.YEAR:
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
