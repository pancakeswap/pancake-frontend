import { Box, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import Banner from 'views/TradingReward/components/TopTraders/Banner'
import YourTradingReward from 'views/TradingReward/components/TopTraders/YourTradingReward'
import CurrentRewardPool from 'views/TradingReward/components/TopTraders/CurrentRewardPool'
import HowToEarn from 'views/TradingReward/components/HowToEarn'
import RewardsBreakdown from 'views/TradingReward/components/RewardsBreakdown'
import Questions from 'views/TradingReward/components/Questions'
import useAllTradingRewardPair, { RewardStatus, RewardType } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import useCampaignIdInfo from 'views/TradingReward/hooks/useCampaignIdInfo'
import useAllUserCampaignInfo from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import SubMenu from 'views/TradingReward/components/SubMenu'
import Leaderboard from 'views/TradingReward/components/Leaderboard'
import useScrollToHash from 'hooks/useScrollToHash'

const TradingRewardTopTraders = () => {
  const { chainId } = useActiveChainId()
  const { isMobile } = useMatchBreakpoints()
  const { data: allTradingRewardPairData, isFetching: isAllTradingRewardPairDataFetching } = useAllTradingRewardPair({
    status: RewardStatus.ALL,
    type: RewardType.TOP_TRADERS,
  })
  const campaignId = allTradingRewardPairData.campaignIds[allTradingRewardPairData.campaignIds.length - 1]
  const { data: campaignInfoData, isFetching: isCampaignInfoFetching } = useCampaignIdInfo({
    campaignId,
    type: RewardType.TOP_TRADERS,
  })
  const { data: allUserCampaignInfo, isFetching: isAllUserCampaignInfo } = useAllUserCampaignInfo({
    campaignIds: allTradingRewardPairData.campaignIds,
    type: RewardType.TOP_TRADERS,
  })

  const isFetching = useMemo(
    () => isAllTradingRewardPairDataFetching || isAllUserCampaignInfo || isCampaignInfoFetching,
    [isAllTradingRewardPairDataFetching, isAllUserCampaignInfo, isCampaignInfoFetching],
  )

  useScrollToHash(isFetching, isMobile)

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
          campaignClaimTime: tradingRewardPair?.campaignClaimTime,
          campaignClaimEndTime: tradingRewardPair?.campaignClaimEndTime,
        }
      })
      .filter((item) => currentTime > item?.campaignClaimTime ?? 0)
  }, [allTradingRewardPairData, allUserCampaignInfo])

  if (chainId !== ChainId.BSC) {
    return null
  }

  return (
    <Box>
      <SubMenu />
      <Banner />
      <YourTradingReward
        isFetching={isFetching}
        incentives={currentUserIncentive}
        qualification={allTradingRewardPairData.qualification}
        campaignIds={allTradingRewardPairData.campaignIds}
        campaignIdsIncentive={allTradingRewardPairData.campaignIdsIncentive}
        rewardInfo={allTradingRewardPairData.rewardInfo}
        totalAvailableClaimData={totalAvailableClaimData}
        currentUserCampaignInfo={currentUserCampaignInfo}
      />
      <CurrentRewardPool incentives={currentUserIncentive} campaignInfoData={campaignInfoData} />
      <Leaderboard campaignIdsIncentive={allTradingRewardPairData.campaignIdsIncentive} />
      <HowToEarn />
      <RewardsBreakdown
        allUserCampaignInfo={allUserCampaignInfo}
        allTradingRewardPairData={allTradingRewardPairData}
        campaignPairs={allTradingRewardPairData.campaignPairs}
      />
      <Questions />
    </Box>
  )
}

export default TradingRewardTopTraders
