import { useTokenPriceChartData } from 'views/V3Info/hooks'
import { useMemo } from 'react'

export const usePairTokensPrice = (
  token0Address: string,
  token1Address: string,
  baseToken: 'token0' | 'token1',
  duration?: 'day' | 'week' | 'month' | 'year',
) => {
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
            value: baseToken === 'token0' ? token0PriceObject[d.time] / d.close : d.close / token0PriceObject[d.time],
          })
      })
    }
    return pairPrices
  }, [token0Price, token1Price, baseToken])

  return pairPriceData
}
