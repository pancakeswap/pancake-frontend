import BigNumber from 'bignumber.js'
import { useCakePrice } from 'hooks/useCakePrice'
import { MetricDetail } from 'views/AffiliatesProgram/hooks/useAuthAffiliate'
import { useQuery } from '@tanstack/react-query'

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
  const cakePriceBusd = useCakePrice()

  const { data, isLoading } = useQuery(
    ['affiliates-program', 'affiliate-program-leaderboard', cakePriceBusd],
    async () => {
      const response = await fetch(`/api/affiliates-program/leader-board`)
      const result = await response.json()
      const list: ListType[] = result.affiliates.map((affiliate) => {
        const cakeBalance = new BigNumber(affiliate.metric.totalEarnFeeUSD).div(cakePriceBusd)
        return {
          ...affiliate,
          cakeBalance: cakeBalance.isNaN() ? '0' : cakeBalance.toString(),
        }
      })
      return list
    },
    {
      enabled: cakePriceBusd.gt(0),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  )

  return {
    isFetching: isLoading,
    list: data ?? [],
  }
}

export default useLeaderboard
