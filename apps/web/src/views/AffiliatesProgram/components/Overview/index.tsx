import AffiliatesProgramLayout from 'views/AffiliatesProgram/components/AffiliatesProgramLayout'
import OnBoardingModal from 'views/AffiliatesProgram/components/OnBoardingModal'
import AffiliatesBanner from 'views/AffiliatesProgram/components/Overview/AffiliatesBanner'
import Benefits from 'views/AffiliatesProgram/components/Overview/Benefits'
import HowItWork from 'views/AffiliatesProgram/components/Overview/HowItWork'
import Question from 'views/AffiliatesProgram/components/Overview/Question'
import RewardCalculate from 'views/AffiliatesProgram/components/Overview/RewardCalculate'
// import AffiliateModal from 'views/AffiliatesProgram/components/Dashboard/AffiliateModal'

const AffiliatesProgram = () => {
  return (
    <AffiliatesProgramLayout>
      <OnBoardingModal />
      {/* <AffiliateModal /> */}
      <AffiliatesBanner />
      <HowItWork />
      <RewardCalculate />
      <Benefits />
      <Question />
    </AffiliatesProgramLayout>
  )
}

AffiliatesProgram.chains = []

export default AffiliatesProgram
