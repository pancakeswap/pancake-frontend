import { Flex } from '@pancakeswap/uikit'
import AffiliatesProgramLayout from 'views/AffiliatesProgram/components/AffiliatesProgramLayout'
import Banner from 'views/AffiliatesProgram/components/Dashboard/Banner'
import MyReferralLink from 'views/AffiliatesProgram/components/Dashboard/MyReferralLink'
import CommissionInfo from 'views/AffiliatesProgram/components/Dashboard/CommissionInfo'

const Dashboard = () => {
  return (
    <AffiliatesProgramLayout>
      <Banner />
      <Flex justifyContent={['center']}>
        <CommissionInfo />
        <MyReferralLink />
      </Flex>
    </AffiliatesProgramLayout>
  )
}

export default Dashboard
