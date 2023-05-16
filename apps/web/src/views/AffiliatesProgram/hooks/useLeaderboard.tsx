import useSWRImmutable from 'swr/immutable'
import BigNumber from 'bignumber.js'
import { usePriceCakeUSD } from 'state/farms/hooks'
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
  const cakePriceBusd = usePriceCakeUSD()

  const { data, isLoading } = useSWRImmutable(
    cakePriceBusd.gt(0) && ['/affiliate-program-leaderboard', cakePriceBusd],
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
  )

  return {
    isFetching: isLoading,
    list: data ?? [],
  }
}

export default useLeaderboard
