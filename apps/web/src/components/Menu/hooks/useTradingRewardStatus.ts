import { useMemo } from 'react'
import useAllTradingRewardPair, { RewardStatus, RewardType } from 'views/TradingReward/hooks/useAllTradingRewardPair'

export const useTradingRewardStatus = () => {
  const { data: allTradingRewardPairData } = useAllTradingRewardPair({
    status: RewardStatus.ALL,
    type: RewardType.CAKE_STAKERS,
  })

  const latestCampaignId = allTradingRewardPairData.campaignIds?.[allTradingRewardPairData.campaignIds.length - 1]

  return useMemo(() => {
    const currentTime = Date.now() / 1000
    if (latestCampaignId) {
      const incentive = allTradingRewardPairData.campaignIdsIncentive.find(
        (i) => i.campaignId && i.campaignId.toLowerCase() === latestCampaignId?.toLowerCase(),
      )

      if (incentive && currentTime >= incentive?.campaignStart && currentTime <= incentive?.campaignClaimTime) {
        return 'live'
      }
    }

    return ''
  }, [latestCampaignId, allTradingRewardPairData])
}
