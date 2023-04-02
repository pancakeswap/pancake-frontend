import useSWRImmutable from 'swr/immutable'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from './bigNumber'

export const useCakePrice = () => {
  return useSWRImmutable(
    ['cake-usd-price'],
    async () => {
      const cake = await (await fetch('https://farms-api.pancakeswap.com/price/cake')).json()
      return cake.price as string
    },
    {
      refreshInterval: 1_000 * 10,
    },
  )
}

// for migration to bignumber.js to avoid breaking changes
export const useCakePriceAsBN = () => {
  const { data } = useSWRImmutable(
    ['cake-usd-price-bn'],
    async () => {
      const cake = await (await fetch('https://farms-api.pancakeswap.com/price/cake')).json()
      return new BigNumber(cake.price)
    },
    {
      compare: (a, b) => {
        if (!a && !b) return true
        if (!a || !b) return false
        return a.eq(b)
      },
      refreshInterval: 1_000 * 10,
    },
  )

  return data ?? BIG_ZERO
}
