import { Flex } from '@pancakeswap/uikit'
import CurrentPeriod from 'views/TradingReward/components/YourTradingReward/CurrentPeriod'
import TotalPeriod from 'views/TradingReward/components/YourTradingReward/TotalPeriod'

interface ExpiringUnclaimProps {
  currentCanClaim: string
  currentTradingVolume: number
  currentCampaignClaimEndTime: number
}

const ExpiringUnclaim: React.FC<React.PropsWithChildren<ExpiringUnclaimProps>> = ({
  currentCanClaim,
  currentTradingVolume,
  currentCampaignClaimEndTime,
}) => {
  return (
    <Flex
      padding="0 16px"
      width={['100%', '100%', '100%', '900px']}
      margin={['32px auto 61px auto']}
      justifyContent="space-between"
      flexDirection={['column', 'column', 'column', 'row']}
    >
      <CurrentPeriod
        currentCanClaim={currentCanClaim}
        currentTradingVolume={currentTradingVolume}
        currentCampaignClaimEndTime={currentCampaignClaimEndTime}
      />
      <TotalPeriod />
    </Flex>
  )
}

export default ExpiringUnclaim
