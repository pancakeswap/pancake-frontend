import { Box } from '@pancakeswap/uikit'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Banner from 'views/TradingReward/components/Banner'
import YourTradingReward from 'views/TradingReward/components/YourTradingReward'
import CurrentRewardPool from 'views/TradingReward/components/CurrentRewardPool'
import HowToEarn from 'views/TradingReward/components/HowToEarn'
import RewardsBreakdown from 'views/TradingReward/components/RewardsBreakdown'
import Questions from 'views/TradingReward/components/Questions'
import useAllTradingRewardPair from 'views/TradingReward/hooks/useAllTradingRewardPair'
import useCampaignIdInfo from 'views/TradingReward/hooks/useCampaignIdInfo'
import useAllUserCampaignInfo from 'views/TradingReward/hooks/useAllUserCampaignInfo'

const TradingReward = () => {
  const [showPage, setShowPage] = useState(false)
  const router = useRouter()
  const campaignId = router?.query?.campaignId?.toString() ?? ''

  const { data: campaignInfoData, isFetching: isCampaignInfoFetching } = useCampaignIdInfo(campaignId)
  const { data: allTradingRewardPairData } = useAllTradingRewardPair()
  const { data: allUserCampaignInfo } = useAllUserCampaignInfo(allTradingRewardPairData.campaignIds)

  useEffect(() => {
    if (campaignId) setShowPage(true)
  }, [campaignId])

  const currentUserIncentive = useMemo(
    () =>
      allTradingRewardPairData.campaignIdsIncentive.find(
        (campaign) => campaign.campaignId.toLowerCase() === campaignId.toLowerCase(),
      ),
    [campaignId, allTradingRewardPairData],
  )
  const currentUserCampaignInfo = useMemo(
    () => allUserCampaignInfo.find((campaign) => campaign.campaignId.toLowerCase() === campaignId.toLowerCase()),
    [campaignId, allUserCampaignInfo],
  )

  if (!showPage) {
    return null
  }

  return (
    <Box>
      <Banner data={campaignInfoData} isFetching={isCampaignInfoFetching} />
      <YourTradingReward incentives={currentUserIncentive} userCampaignInfoData={currentUserCampaignInfo} />
      <CurrentRewardPool incentives={currentUserIncentive} campaignInfoData={currentUserCampaignInfo} />
      <HowToEarn />
      <RewardsBreakdown />
      <Questions />
    </Box>
  )
}

TradingReward.chains = []

export default TradingReward
