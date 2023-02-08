import { PageMeta } from 'components/Layout/Page'
import AffiliatesBanner from 'views/AffiliatesProgram//components/Overview/AffiliatesBanner'
import HowItWork from 'views/AffiliatesProgram//components/Overview/HowItWork'
import Benefits from 'views/AffiliatesProgram//components/Overview/Benefits'
import RewardCalculate from 'views/AffiliatesProgram//components/Overview/RewardCalculate'
import Question from 'views/AffiliatesProgram//components/Overview/Question'

const AffiliatesProgram = () => {
  return (
    <>
      <PageMeta />
      <AffiliatesBanner />
      <HowItWork />
      <RewardCalculate />
      <Benefits />
      <Question />
    </>
  )
}

export default AffiliatesProgram
