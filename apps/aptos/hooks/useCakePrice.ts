import { useQuery } from '@pancakeswap/awgmi'

export const useCakePrice = () => {
  return useQuery(
    ['cake-usd-price'],
    async () => {
      const cake = await (await fetch('https://farms-api.pancakeswap.com/price/cake')).json()
      return cake.price as string
    },
    {
      refetchInterval: 1_000 * 10,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  )
}
