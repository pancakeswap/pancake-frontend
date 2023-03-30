import { usePairPriceChartTokenData } from 'views/V3Info/hooks'
import { Currency, ChainId } from '@pancakeswap/sdk'
import { PairDataTimeWindowEnum } from '@pancakeswap/uikit'
import { useMemo } from 'react'

export const usePairTokensPrice = (
  token0?: Currency | string,
  token1?: Currency | string,
  duration?: PairDataTimeWindowEnum,
  chianId?: ChainId,
) => {
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

  const token0Address = useMemo(
    () =>
      typeof token0 === 'string'
        ? token0.toLowerCase()
        : (token0?.isToken ? token0?.address : token0?.wrapped?.address)?.toLowerCase(),
    [token0],
  )
  const token1Address = useMemo(
    () =>
      typeof token1 === 'string'
        ? token1.toLowerCase()
        : (token1?.isToken ? token1?.address : token1?.wrapped?.address)?.toLowerCase(),
    [token1],
  )

  const token0Price = usePairPriceChartTokenData(token0Address, priceTimeWindow, chianId)
  const token1Price = usePairPriceChartTokenData(token1Address, priceTimeWindow, chianId)

  const pairPriceData: { time: Date; value: number }[] = useMemo(() => {
    const pairPrices = []
    const token0PriceObject: Record<number, number> = {}
    if (token0Price.length > 0 && token1Price.length > 0) {
      token0Price.forEach((d) => {
        token0PriceObject[d.time] = d.close
      })
      token1Price.forEach((d) => {
        if (token0PriceObject[d.time])
          pairPrices.push({
            time: new Date(d.time * 1000),
            value: token0PriceObject[d.time] / d.close,
          })
      })
    }
    return pairPrices
  }, [token0Price, token1Price])

  return pairPriceData
}
