import { useMemo } from 'react'
import useAllTradingRewardPair from 'views/TradingReward/hooks/useAllTradingRewardPair'

export const useTradingRewardStatus = () => {
  const { data: allTradingRewardPairData } = useAllTradingRewardPair()
  const latestCampaignId = allTradingRewardPairData.campaignIds?.[allTradingRewardPairData.campaignIds.length - 1]

  return useMemo(() => {
    const currentTime = new Date().getTime() / 1000
    if (latestCampaignId) {
      const incentive = allTradingRewardPairData.campaignIdsIncentive.find(
        (i) => i.campaignId.toLowerCase() === latestCampaignId?.toLowerCase(),
      )

      if (currentTime >= incentive?.campaignStart && currentTime <= incentive?.campaignClaimTime) {
        return 'live'
      }
    }

    return ''
  }, [latestCampaignId, allTradingRewardPairData])
}
