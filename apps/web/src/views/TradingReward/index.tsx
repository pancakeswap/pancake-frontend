import { Box } from '@pancakeswap/uikit'
import Banner from 'views/TradingReward/components/Banner'
import RewardsBreakdown from 'views/TradingReward/components/RewardsBreakdown'
import Questions from 'views/TradingReward/components/Questions'

const TradingReward = () => {
  return (
    <Box>
      <Banner />
      <RewardsBreakdown />
      <Questions />
    </Box>
  )
}

export default TradingReward
