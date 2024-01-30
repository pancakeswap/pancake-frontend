import { Flex } from '@pancakeswap/uikit'
import CurrentPeriod from 'views/TradingReward/components/YourTradingReward/CurrentPeriod'
import TotalPeriod from 'views/TradingReward/components/YourTradingReward/TotalPeriod'
import { Incentives, Qualification, RewardInfo, RewardType } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'

interface RewardPeriodProps {
  campaignIds: Array<string>
  campaignStart: number
  campaignClaimTime: number
  incentives: Incentives
  rewardInfo: { [key in string]: RewardInfo }
  totalAvailableClaimData: UserCampaignInfoDetail[]
  currentUserCampaignInfo: UserCampaignInfoDetail
  isQualified: boolean
  isValidLockAmount: boolean
  isValidLockDuration: boolean
  thresholdLockTime: number
  qualification: Qualification
  campaignIdsIncentive: Incentives[]
}

const RewardPeriod: React.FC<React.PropsWithChildren<RewardPeriodProps>> = ({
  campaignIds,
  campaignStart,
  campaignClaimTime,
  incentives,
  currentUserCampaignInfo,
  rewardInfo,
  totalAvailableClaimData,
  isQualified,
  isValidLockAmount,
  isValidLockDuration,
  thresholdLockTime,
  qualification,
  campaignIdsIncentive,
}) => {
  return (
    <Flex
      padding="0 16px"
      width={['100%', '100%', '100%', '100%', '900px']}
      margin={['32px auto 61px auto']}
      justifyContent="space-between"
      flexDirection={['column', 'column', 'column', 'row']}
    >
      <CurrentPeriod
        incentives={incentives}
        rewardInfo={rewardInfo}
        campaignStart={campaignStart}
        campaignClaimTime={campaignClaimTime}
        currentUserCampaignInfo={currentUserCampaignInfo}
        isQualified={isQualified}
        isValidLockAmount={isValidLockAmount}
        isValidLockDuration={isValidLockDuration}
        thresholdLockTime={thresholdLockTime}
        totalAvailableClaimData={totalAvailableClaimData}
      />
      <TotalPeriod
        type={RewardType.CAKE_STAKERS}
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
