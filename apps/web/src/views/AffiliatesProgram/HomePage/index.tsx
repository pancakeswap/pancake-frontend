import { PageMeta } from 'components/Layout/Page'
import AffiliatesBanner from 'views/AffiliatesProgram/HomePage/AffiliatesBanner'
import HowItWork from 'views/AffiliatesProgram/HomePage/HowItWork'
import RewardFee from 'views/AffiliatesProgram/HomePage/RewardFee'
import Benefits from 'views/AffiliatesProgram/HomePage/Benefits'
import RewardCalculate from 'views/AffiliatesProgram/HomePage/RewardCalculate'
import Question from 'views/AffiliatesProgram/HomePage/Question'

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
