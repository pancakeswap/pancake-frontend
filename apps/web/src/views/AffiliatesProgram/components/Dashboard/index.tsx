import { Flex } from '@pancakeswap/uikit'
import AffiliatesProgramLayout from 'views/AffiliatesProgram/components/AffiliatesProgramLayout'
import Banner from 'views/AffiliatesProgram/components/Dashboard/Banner'
import MyReferralLink from 'views/AffiliatesProgram/components/Dashboard/MyReferralLink'
import CommissionInfo from 'views/AffiliatesProgram/components/Dashboard/CommissionInfo'
import ClaimReward from 'views/AffiliatesProgram/components/Dashboard/ClaimReward'

const Dashboard = () => {
  return (
    <AffiliatesProgramLayout>
      <Banner />
      <Flex
        padding="0 16px"
        m={['68px 0 24px 0']}
        justifyContent={['center']}
        flexDirection={['column-reverse', 'column-reverse', 'column-reverse', 'row']}
      >
        <CommissionInfo />
        <MyReferralLink />
      </Flex>
      <ClaimReward />
    </AffiliatesProgramLayout>
  )
}

export default Dashboard
