import { Flex } from '@pancakeswap/uikit'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import CurrentPeriod from 'views/TradingReward/components/YourTradingReward/CurrentPeriod'
import TotalPeriod from 'views/TradingReward/components/YourTradingReward/TotalPeriod'

interface ExpiringUnclaimProps {
  campaignIds: Array<string>
  canClaim: string
  currentTradingVolume: number
  campaignClaimTime: number
  totalAvailableClaimData: UserCampaignInfoDetail[]
}

const ExpiringUnclaim: React.FC<React.PropsWithChildren<ExpiringUnclaimProps>> = ({
  campaignIds,
  canClaim,
  currentTradingVolume,
  campaignClaimTime,
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
        canClaim={canClaim}
        currentTradingVolume={currentTradingVolume}
        campaignClaimTime={campaignClaimTime}
      />
      <TotalPeriod campaignIds={campaignIds} totalAvailableClaimData={totalAvailableClaimData} />
    </Flex>
  )
}

export default ExpiringUnclaim
