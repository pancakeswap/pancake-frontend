import { Flex } from '@pancakeswap/uikit'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import CurrentPeriod from 'views/TradingReward/components/YourTradingReward/CurrentPeriod'
import TotalPeriod from 'views/TradingReward/components/YourTradingReward/TotalPeriod'
import { DeserializedLockedVaultUser } from 'state/types'
import { Incentives, RewardInfo, Qualification, RewardType } from 'views/TradingReward/hooks/useAllTradingRewardPair'

interface RewardPeriodProps {
  campaignIds: Array<string>
  campaignStart: number
  campaignClaimTime: number
  incentives: Incentives
  userData: DeserializedLockedVaultUser
  rewardInfo: { [key in string]: RewardInfo }
  totalAvailableClaimData: UserCampaignInfoDetail[]
  currentUserCampaignInfo: UserCampaignInfoDetail
  isQualified: boolean
  isLockPosition: boolean
  isValidLockDuration: boolean
  thresholdLockTime: number
  qualification: Qualification
  campaignIdsIncentive: Incentives[]
}

const RewardPeriod: React.FC<React.PropsWithChildren<RewardPeriodProps>> = ({
  campaignIds,
  campaignStart,
  campaignClaimTime,
  userData,
  incentives,
  currentUserCampaignInfo,
  rewardInfo,
  totalAvailableClaimData,
  isQualified,
  isLockPosition,
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
        userData={userData}
        incentives={incentives}
        rewardInfo={rewardInfo}
        campaignStart={campaignStart}
        campaignClaimTime={campaignClaimTime}
        currentUserCampaignInfo={currentUserCampaignInfo}
        isQualified={isQualified}
        isLockPosition={isLockPosition}
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
