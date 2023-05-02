import { Flex, Pool } from '@pancakeswap/uikit'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import CurrentPeriod from 'views/TradingReward/components/YourTradingReward/CurrentPeriod'
import TotalPeriod from 'views/TradingReward/components/YourTradingReward/TotalPeriod'
import { DeserializedLockedVaultUser } from 'state/types'
import { Token } from '@pancakeswap/sdk'
import { Incentives, RewardInfo } from 'views/TradingReward/hooks/useAllTradingRewardPair'

interface ExpiringUnclaimProps {
  campaignIds: Array<string>
  campaignClaimTime: number
  incentives: Incentives
  pool: Pool.DeserializedPool<Token>
  userData: DeserializedLockedVaultUser
  rewardInfo: { [key in string]: RewardInfo }
  totalAvailableClaimData: UserCampaignInfoDetail[]
  currentUserCampaignInfo: UserCampaignInfoDetail
}

const ExpiringUnclaim: React.FC<React.PropsWithChildren<ExpiringUnclaimProps>> = ({
  campaignIds,
  campaignClaimTime,
  userData,
  pool,
  incentives,
  currentUserCampaignInfo,
  rewardInfo,
  totalAvailableClaimData,
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
        pool={pool}
        userData={userData}
        incentives={incentives}
        rewardInfo={rewardInfo}
        campaignClaimTime={campaignClaimTime}
        currentUserCampaignInfo={currentUserCampaignInfo}
      />
      {/* <TotalPeriod campaignIds={campaignIds} totalAvailableClaimData={totalAvailableClaimData} /> */}
    </Flex>
  )
}

export default ExpiringUnclaim
