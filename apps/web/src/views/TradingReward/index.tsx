import { Box } from '@pancakeswap/uikit'
import Banner from 'views/TradingReward/components/Banner'
import HowToEarn from 'views/TradingReward/components/HowToEarn'
import RewardsBreakdown from 'views/TradingReward/components/RewardsBreakdown'
import Questions from 'views/TradingReward/components/Questions'

const TradingReward = () => {
  return (
    <Box>
      <Banner />
      <HowToEarn />
      <RewardsBreakdown />
      <Questions />
    </Box>
  )
}

export default TradingReward
