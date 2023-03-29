import AffiliatesProgramLayout from 'views/AffiliatesProgram/components/AffiliatesProgramLayout'
import ComingSoon from 'views/AffiliatesProgram/components/Dashboard/ComingSoon'
// import AffiliatesBanner from 'views/AffiliatesProgram/components/Overview/AffiliatesBanner'
// import HowItWork from 'views/AffiliatesProgram/components/Overview/HowItWork'
// import Benefits from 'views/AffiliatesProgram/components/Overview/Benefits'
// import RewardCalculate from 'views/AffiliatesProgram/components/Overview/RewardCalculate'
// import Question from 'views/AffiliatesProgram/components/Overview/Question'
import OnBoardingModal from 'views/AffiliatesProgram/components/OnBoardingModal'

const AffiliatesProgram = () => {
  return (
    <AffiliatesProgramLayout>
      <OnBoardingModal />
      <div style={{ margin: '50px 0', height: '550px' }}>
        <ComingSoon />
      </div>
      {/* <AffiliatesBanner />
      <HowItWork />
      <RewardCalculate />
      <Benefits />
      <Question /> */}
    </AffiliatesProgramLayout>
  )
}

export default AffiliatesProgram
