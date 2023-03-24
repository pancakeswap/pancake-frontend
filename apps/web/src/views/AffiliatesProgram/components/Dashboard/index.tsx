import { useEffect } from 'react'
import { Flex } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import AffiliatesProgramLayout from 'views/AffiliatesProgram/components/AffiliatesProgramLayout'
import Banner from 'views/AffiliatesProgram/components/Dashboard/Banner'
import MyReferralLink from 'views/AffiliatesProgram/components/Dashboard/MyReferralLink'
import useAuthAffiliate from 'views/AffiliatesProgram/hooks/useAuthAffiliate'
import useAuthAffiliateExist from 'views/AffiliatesProgram/hooks/useAuthAffiliateExist'
import LoginButton from 'views/AffiliatesProgram/components/Dashboard/LoginButton'
import CommissionInfo from 'views/AffiliatesProgram/components/Dashboard/CommissionInfo'
import ClaimReward from 'views/AffiliatesProgram/components/Dashboard/ClaimReward'
import AffiliateLinks from 'views/AffiliatesProgram/components/Dashboard/AffiliateLinks'

const Dashboard = () => {
  const router = useRouter()
  const { isAffiliate, affiliate, refresh } = useAuthAffiliate()
  const { isAffiliateExist } = useAuthAffiliateExist()

  useEffect(() => {
    if (isAffiliateExist === false && isAffiliateExist !== null) {
      router.push('/affiliates-program')
    }
  }, [isAffiliateExist, isAffiliate, router])

  if (!isAffiliateExist) {
    return null
  }

  return (
    <AffiliatesProgramLayout>
      <Banner />
      {!isAffiliate ? (
        <LoginButton />
      ) : (
        <Flex
          padding="0 16px"
          m={['24px 0', '24px 0', '24px 0', '68px 0 24px 0']}
          justifyContent={['center']}
          flexDirection={['column', 'column', 'column', 'column', 'column', 'row']}
        >
          <CommissionInfo />
          <Flex flexDirection="column">
            <MyReferralLink refreshAffiliateInfo={refresh} />
            <AffiliateLinks affiliate={affiliate} />
            <ClaimReward />
          </Flex>
        </Flex>
      )}
    </AffiliatesProgramLayout>
  )
}

export default Dashboard
