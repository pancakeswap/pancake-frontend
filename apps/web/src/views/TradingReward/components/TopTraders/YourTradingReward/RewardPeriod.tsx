import { Flex } from '@pancakeswap/uikit'
import CurrentPeriod from 'views/TradingReward/components/TopTraders/YourTradingReward/CurrentPeriod'
import TotalPeriod from 'views/TradingReward/components/YourTradingReward/TotalPeriod'
import { Incentives, Qualification, RewardInfo, RewardType } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'

interface RewardPeriodProps {
  campaignIds: Array<string>
  rewardInfo: { [key in string]: RewardInfo }
  qualification: Qualification
  campaignStart: number
  campaignClaimTime: number
  totalAvailableClaimData: UserCampaignInfoDetail[]
  campaignIdsIncentive: Incentives[]
  currentUserCampaignInfo: UserCampaignInfoDetail
}

const RewardPeriod: React.FC<React.PropsWithChildren<RewardPeriodProps>> = ({
  campaignIds,
  rewardInfo,
  qualification,
  campaignStart,
  campaignClaimTime,
  totalAvailableClaimData,
  campaignIdsIncentive,
  currentUserCampaignInfo,
}) => {
  return (
    <Flex
      width={['100%', '100%', '100%', '100%', '900px']}
      margin={['32px auto 61px auto']}
      justifyContent="space-between"
      flexDirection={['column', 'column', 'column', 'row']}
    >
      <CurrentPeriod
        rewardInfo={rewardInfo}
        campaignStart={campaignStart}
        campaignClaimTime={campaignClaimTime}
        currentUserCampaignInfo={currentUserCampaignInfo}
      />
      <TotalPeriod
        type={RewardType.TOP_TRADERS}
        campaignIds={campaignIds}
        rewardInfo={rewardInfo}
        qualification={qualification}
        totalAvailableClaimData={totalAvailableClaimData}
        campaignIdsIncentive={campaignIdsIncentive}
      />
    </Flex>
  )
}

export default RewardPeriod
