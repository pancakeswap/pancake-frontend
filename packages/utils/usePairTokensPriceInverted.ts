export const usePairTokensPriceInverted = (
  prices?: {
    pairPriceData: {
      time: Date
      value: number
    }[]
    maxPrice: number
    minPrice: number
    averagePrice: number
  },
  invertPrice?: boolean,
) => {
  if (!prices || !prices.pairPriceData.length) {
    return {
      min: 0,
      max: 0,
      average: 0,
    }
  }

  const _prices = prices.pairPriceData.map((p) => ({
    ...p,
    value: invertPrice ? p.value : p.value > 0 ? 1 / p.value : 0,
  }))

  let _sum = 0
  let _min = Number.MAX_VALUE
  let _max = 0
  for (const { value } of _prices) {
    _sum += value
    _min = Math.min(_min, value)
    _max = Math.max(_max, value)
  }

  return {
    min: _min,
    max: _max,
    average: _sum / _prices.length,
  }
}
