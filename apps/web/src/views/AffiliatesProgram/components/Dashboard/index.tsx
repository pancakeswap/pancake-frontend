import { Flex } from '@pancakeswap/uikit'
import AffiliatesProgramLayout from 'views/AffiliatesProgram/components/AffiliatesProgramLayout'
import Banner from 'views/AffiliatesProgram/components/Dashboard/Banner'
import MyReferralLink from 'views/AffiliatesProgram/components/Dashboard/MyReferralLink'

const Dashboard = () => {
  return (
    <AffiliatesProgramLayout>
      <Banner />
      <Flex justifyContent={['center']}>
        <MyReferralLink />
      </Flex>
    </AffiliatesProgramLayout>
  )
}

export default Dashboard
