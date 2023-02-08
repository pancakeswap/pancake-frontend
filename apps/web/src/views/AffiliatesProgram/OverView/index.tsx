import { PageMeta } from 'components/Layout/Page'
import AffiliatesBanner from 'views/AffiliatesProgram/Overview/AffiliatesBanner'
import HowItWork from 'views/AffiliatesProgram/Overview/HowItWork'
import RewardFee from 'views/AffiliatesProgram/Overview/RewardFee'
import Benefits from 'views/AffiliatesProgram/Overview/Benefits'
import RewardCalculate from 'views/AffiliatesProgram/Overview/RewardCalculate'
import Question from 'views/AffiliatesProgram/Overview/Question'

const AffiliatesProgram = () => {
  return (
    <>
      <PageMeta />
      <AffiliatesBanner />
      <HowItWork />
      <RewardFee />
      <Benefits />
      <RewardCalculate />
      <Question />
    </>
  )
}

export default AffiliatesProgram
