import { Box } from '@pancakeswap/uikit'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Banner from 'views/TradingReward/components/Banner'
import YourTradingReward from 'views/TradingReward/components/YourTradingReward'
import CurrentRewardPool from 'views/TradingReward/components/CurrentRewardPool'
import HowToEarn from 'views/TradingReward/components/HowToEarn'
import RewardsBreakdown from 'views/TradingReward/components/RewardsBreakdown'
import Questions from 'views/TradingReward/components/Questions'

const TradingReward = () => {
  const [showPage, setShowPage] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (router.query.campaignId) {
      setShowPage(true)
    } else {
      router.push('/')
    }
  }, [router])

  if (!showPage) {
    return null
  }

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

TradingReward.chains = []

export default TradingReward
