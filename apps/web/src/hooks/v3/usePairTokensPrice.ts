import { useTokenPriceChartData } from 'views/V3Info/hooks'
import { Currency } from '@pancakeswap/sdk'
import { useMemo } from 'react'

export const usePairTokensPrice = (
  token0: Currency,
  token1: Currency,
  duration?: 'day' | 'week' | 'month' | 'year',
) => {
  const token0Address = useMemo(
    () => (token0?.isToken ? token0?.address : token0?.wrapped?.address).toLowerCase(),
    [token0],
  )
  const token1Address = useMemo(
    () => (token1?.isToken ? token1?.address : token1?.wrapped?.address).toLowerCase(),
    [token1],
  )

  const token0Price = useTokenPriceChartData(token0Address, duration)
  const token1Price = useTokenPriceChartData(token1Address, duration)
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
