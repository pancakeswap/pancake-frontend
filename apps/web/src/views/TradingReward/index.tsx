import { Box } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import Banner from 'views/TradingReward/components/Banner'
import { ChainId } from '@pancakeswap/sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import YourTradingReward from 'views/TradingReward/components/YourTradingReward'
import CurrentRewardPool from 'views/TradingReward/components/CurrentRewardPool'
import HowToEarn from 'views/TradingReward/components/HowToEarn'
import RewardsBreakdown from 'views/TradingReward/components/RewardsBreakdown'
import Questions from 'views/TradingReward/components/Questions'
import useAllTradingRewardPair from 'views/TradingReward/hooks/useAllTradingRewardPair'
import useCampaignIdInfo from 'views/TradingReward/hooks/useCampaignIdInfo'
import useAllUserCampaignInfo from 'views/TradingReward/hooks/useAllUserCampaignInfo'

const TradingReward = () => {
  const { chainId } = useActiveChainId()

  const { data: allTradingRewardPairData, isFetching: isAllTradingRewardPairDataFetching } = useAllTradingRewardPair()
  const campaignId = allTradingRewardPairData.campaignIds[allTradingRewardPairData.campaignIds.length - 1]
  const { data: campaignInfoData, isFetching: isCampaignInfoFetching } = useCampaignIdInfo(campaignId)
  const { data: allUserCampaignInfo, isFetching: isAllUserCampaignInfo } = useAllUserCampaignInfo(
    allTradingRewardPairData.campaignIds,
  )

  const isFetching = useMemo(
    () => isAllTradingRewardPairDataFetching || isAllUserCampaignInfo,
    [isAllTradingRewardPairDataFetching, isAllUserCampaignInfo],
  )

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
    const currentTime = new Date().getTime() / 1000

    return allUserCampaignInfo
      .map((item) => {
        const tradingRewardPair = allTradingRewardPairData.campaignIdsIncentive.find(
          (pair) => pair.campaignId === item.campaignId,
        )

        return {
          ...item,
          campaignClaimTime: tradingRewardPair.campaignClaimTime,
          campaignClaimEndTime: tradingRewardPair.campaignClaimEndTime,
        }
      })
      .filter((item) => currentTime > item.campaignClaimTime)
  }, [allTradingRewardPairData, allUserCampaignInfo])

  if (isAllTradingRewardPairDataFetching || chainId !== ChainId.BSC) {
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
        allUserCampaignInfo={allUserCampaignInfo}
        allTradingRewardPairData={allTradingRewardPairData}
        rewardInfo={allTradingRewardPairData.rewardInfo}
        campaignPairs={allTradingRewardPairData.campaignPairs}
      />
      <Questions />
    </Box>
  )
}

export default TradingReward
