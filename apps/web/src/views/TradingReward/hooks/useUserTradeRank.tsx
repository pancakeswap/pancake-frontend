import { useAccount } from 'wagmi'
import { TRADING_REWARD_API } from 'config/constants/endpoints'
import { RewardType } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { useQuery } from '@tanstack/react-query'

const initialState = {
  topTradersIndex: 0,
  totalUsers: 0,
  tradingFee: 0,
  volume: 0,
  estimateRewardUSD: 0,
}

export const useUserTradeRank = ({ campaignId }: { campaignId: string }) => {
  const { address: account } = useAccount()
  const { data, isLoading } = useQuery(
    ['tradingReward', 'user-trade-rank', campaignId, account],
    async () => {
      try {
        const response = await fetch(
          `${TRADING_REWARD_API}/rank_index/campaignId/${campaignId}/address/${account}/type/${RewardType.TOP_TRADERS}`,
        )
        const result = await response.json()
        return {
          topTradersIndex: result?.data?.topTradersIndex ?? 0,
          totalUsers: result?.data?.totalUsers ?? 0,
          tradingFee: result?.data?.tradingFee ?? 0,
          volume: result?.data?.volume ?? 0,
          estimateRewardUSD: result?.data?.estimateRewardUSD ?? 0,
        }
      } catch (error) {
        console.info(`Fetch User Rank Error: ${error}`)
        return initialState
      }
    },
    {
      enabled: Boolean(Number(campaignId) > 0 && account),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      initialData: initialState,
    },
  )

  return {
    data,
    isFetching: isLoading,
  }
}
