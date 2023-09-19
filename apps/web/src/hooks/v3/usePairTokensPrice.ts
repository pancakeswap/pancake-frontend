import { usePairPriceChartTokenData } from 'views/V3Info/hooks'
import { ChainId } from '@pancakeswap/chains'
import { PairDataTimeWindowEnum } from '@pancakeswap/uikit'
import { useMemo } from 'react'

export const usePairTokensPrice = (pairAddress?: string, duration?: PairDataTimeWindowEnum, chainId?: ChainId) => {
  const priceTimeWindow = useMemo(() => {
    switch (duration) {
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

  const pairPrice = usePairPriceChartTokenData(pairAddress?.toLowerCase(), priceTimeWindow, chainId)

  const pairPriceData: { time: Date; value: number }[] = useMemo(() => {
    return pairPrice?.data?.map((d) => ({
      time: new Date(d.time * 1000),
      value: d.close,
    }))
  }, [pairPrice])

  return useMemo(
    () => ({
      pairPriceData,
      maxPrice: pairPrice?.maxPrice,
      minPrice: pairPrice?.minPrice,
      averagePrice: pairPrice?.averagePrice,
    }),
    [pairPriceData, pairPrice],
  )
}
