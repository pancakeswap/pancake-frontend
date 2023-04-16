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
  const { data: allTradingRewardPairData, isFetching: isAllTradingRewardPairDataFetching } = useAllTradingRewardPair()
  const { data: allUserCampaignInfo, isFetching: isAllUserCampaignInfo } = useAllUserCampaignInfo(
    allTradingRewardPairData.campaignIds,
  )

  const isFetching = isAllTradingRewardPairDataFetching || isAllUserCampaignInfo

  useEffect(() => {
    if (!isAllTradingRewardPairDataFetching) {
      if (allTradingRewardPairData.campaignIds.includes(campaignId)) {
        setShowPage(true)
      } else {
        router.push('/')
      }
    }
  }, [allTradingRewardPairData, campaignId, isAllTradingRewardPairDataFetching, router])

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

  const totalAvailableClaimData = useMemo(() => {
    return allUserCampaignInfo.map((item) => {
      const tradingRewardPair = allTradingRewardPairData.campaignIdsIncentive.find(
        (pair) => pair.campaignId === item.campaignId,
      )
      // eslint-disable-next-line no-param-reassign
      item.campaignClaimEndTime = tradingRewardPair.campaignClaimEndTime
      return item
    })
  }, [allTradingRewardPairData, allUserCampaignInfo])

  if (!showPage) {
    return null
  }

  return (
    <Box>
      <Banner data={campaignInfoData} isFetching={isCampaignInfoFetching} />
      <YourTradingReward
        isFetching={isFetching}
        incentives={currentUserIncentive}
        campaignIds={allTradingRewardPairData.campaignIds}
        currentUserCampaignInfo={currentUserCampaignInfo}
        totalAvailableClaimData={totalAvailableClaimData}
      />
      <CurrentRewardPool incentives={currentUserIncentive} campaignInfoData={currentUserCampaignInfo} />
      <HowToEarn />
      <RewardsBreakdown
        campaignId={campaignId}
        allUserCampaignInfo={allUserCampaignInfo}
        allTradingRewardPairData={allTradingRewardPairData}
      />
      <Questions />
    </Box>
  )
}

export default TradingReward
