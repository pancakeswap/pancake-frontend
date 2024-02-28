import { useQuery } from '@tanstack/react-query'
import { BigNumber } from 'bignumber.js'
import { TRADING_REWARD_API } from 'config/constants/endpoints'
import { RewardType } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { useAccount } from 'wagmi'

interface RankListResponse {
  data: {
    estimateReward: string
  }
}

export const useTotalTradingReward = ({ campaignIds }: { campaignIds: Array<string> }): number => {
  const { address: account } = useAccount()

  const { data } = useQuery({
    queryKey: ['user-total-trading-reward', campaignIds, account],

    queryFn: async () => {
      try {
        const allData = await Promise.all(
          campaignIds.map(async (campaignId: string) => {
            const response = await fetch(
              `${TRADING_REWARD_API}/campaign/userEstimate/campaignId/${campaignId}/address/${account}/type/${RewardType.CAKE_STAKERS}`,
            )
            const result: RankListResponse = await response.json()
            return new BigNumber(result.data.estimateReward).toNumber()
          }),
        )

        return allData.reduce((a, b) => new BigNumber(a).plus(b).toNumber(), 0)
      } catch (error) {
        console.info(`Fetch User Total Trading Reward Error: ${error}`)
        return 0
      }
    },

    enabled: Boolean(campaignIds.length > 0 && account),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  return data ?? 0
}
