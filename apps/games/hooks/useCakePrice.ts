import { useQuery } from '@tanstack/react-query'

export const useCakePrice = () => {
  return useQuery({
    queryKey: ['cake-usd-price'],

    queryFn: async () => {
      const cake = await (await fetch('https://farms-api.pancakeswap.com/price/cake')).json()
      return cake.price as string
    },

    refetchInterval: 1_000 * 10,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
}
