import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { useCakePrice } from 'hooks/useCakePrice'
import { MetricDetail } from 'views/AffiliatesProgram/hooks/useAuthAffiliate'

export interface ListType {
  address: string
  nickName: string
  metric: MetricDetail
  cakeBalance?: string
}

interface Leaderboard {
  isFetching: boolean
  list: ListType[]
}

const useLeaderboard = (): Leaderboard => {
  const cakePrice = useCakePrice()

  const { data, isPending } = useQuery({
    queryKey: ['affiliates-program', 'affiliate-program-leaderboard', cakePrice],

    queryFn: async () => {
      const response = await fetch(`/api/affiliates-program/leader-board`)
      const result = await response.json()
      const list: ListType[] = result.affiliates.map((affiliate) => {
        const cakeBalance = new BigNumber(affiliate.metric.totalEarnFeeUSD).div(cakePrice)
        return {
          ...affiliate,
          cakeBalance: cakeBalance.isNaN() ? '0' : cakeBalance.toString(),
        }
      })
      return list
    },

    enabled: cakePrice.gt(0),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  return {
    isFetching: isPending,
    list: data ?? [],
  }
}

export default useLeaderboard
