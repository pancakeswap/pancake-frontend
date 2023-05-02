import { Box } from '@pancakeswap/uikit'
import { useEffect, useMemo } from 'react'
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
  const router = useRouter()
  const campaignId = router?.query?.campaignId?.toString() ?? ''

  const { data: campaignInfoData, isFetching: isCampaignInfoFetching } = useCampaignIdInfo(campaignId)
  const { data: allTradingRewardPairData, isFetching: isAllTradingRewardPairDataFetching } = useAllTradingRewardPair()
  const { data: allUserCampaignInfo, isFetching: isAllUserCampaignInfo } = useAllUserCampaignInfo(
    allTradingRewardPairData.campaignIds,
  )

  const isFetching = useMemo(
    () => isAllTradingRewardPairDataFetching || isAllUserCampaignInfo,
    [isAllTradingRewardPairDataFetching, isAllUserCampaignInfo],
  )
  const showPage = useMemo(
    () => !isAllTradingRewardPairDataFetching && allTradingRewardPairData.campaignIds.includes(campaignId),
    [isAllTradingRewardPairDataFetching, allTradingRewardPairData, campaignId],
  )

  // useEffect(() => {
  //   if (!isAllTradingRewardPairDataFetching) {
  //     if (!allTradingRewardPairData.campaignIds.includes(campaignId)) {
  //       console.log('kick', {
  //         isFetching: !isAllTradingRewardPairDataFetching,
  //         includeCampaignId: !allTradingRewardPairData.campaignIds.includes(campaignId)
  //       })
  //       router.push('/')
  //     }
  //   }
  // }, [allTradingRewardPairData, campaignId, isAllTradingRewardPairDataFetching, router])

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
        qualification={allTradingRewardPairData.qualification}
        campaignIds={allTradingRewardPairData.campaignIds}
        rewardInfo={allTradingRewardPairData.rewardInfo}
        currentUserCampaignInfo={currentUserCampaignInfo}
        totalAvailableClaimData={totalAvailableClaimData}
      />
      <CurrentRewardPool
        campaignId={campaignId}
        incentives={currentUserIncentive}
        campaignInfoData={campaignInfoData}
        rewardInfo={allTradingRewardPairData.rewardInfo}
      />
      <HowToEarn />
      <RewardsBreakdown
        campaignId={campaignId}
        allUserCampaignInfo={allUserCampaignInfo}
        allTradingRewardPairData={allTradingRewardPairData}
        rewardInfo={allTradingRewardPairData.rewardInfo}
      />
      <Questions />
    </Box>
  )
}

export default TradingReward
