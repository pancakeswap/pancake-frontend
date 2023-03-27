import { Box } from '@pancakeswap/uikit'
import Banner from 'views/TradingReward/components/Banner'
import YourTradingReward from 'views/TradingReward/components/YourTradingReward'
import CurrentRewardPool from 'views/TradingReward/components/CurrentRewardPool'
import HowToEarn from 'views/TradingReward/components/HowToEarn'
import RewardsBreakdown from 'views/TradingReward/components/RewardsBreakdown'
import Questions from 'views/TradingReward/components/Questions'

const TradingReward = () => {
  return (
    <Box>
      <Banner />
      <YourTradingReward />
      <CurrentRewardPool />
      <HowToEarn />
      <RewardsBreakdown />
      <Questions />
    </Box>
  )
}

export default TradingReward
