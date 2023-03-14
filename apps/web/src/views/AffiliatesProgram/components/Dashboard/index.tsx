import { useEffect } from 'react'
import { Flex, Button } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useTranslation } from '@pancakeswap/localization'
import AffiliatesProgramLayout from 'views/AffiliatesProgram/components/AffiliatesProgramLayout'
import Banner from 'views/AffiliatesProgram/components/Dashboard/Banner'
import MyReferralLink from 'views/AffiliatesProgram/components/Dashboard/MyReferralLink'
import useAuthAffiliateExist from 'views/AffiliatesProgram/hooks/useAuthAffiliateExist'
//  import CommissionInfo from 'views/AffiliatesProgram/components/Dashboard/CommissionInfo'
// import ClaimReward from 'views/AffiliatesProgram/components/Dashboard/ClaimReward'

const Dashboard = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { isAffiliateExist } = useAuthAffiliateExist()

  useEffect(() => {
    if (!isAffiliateExist) {
      router.push('/affiliates-program')
    }
  }, [isAffiliateExist, router])

  if (!isAffiliateExist) {
    return null
  }

  return (
    <AffiliatesProgramLayout>
      <Banner />
      <Button
        display="block"
        m="40px
        auto"
        width={180}
      >
        {t('Login')}
      </Button>

      <Flex
        padding="0 16px"
        m={['24px 0', '24px 0', '24px 0', '68px 0 24px 0']}
        justifyContent={['center']}
        flexDirection={['column', 'column', 'column', 'column', 'column', 'row']}
      >
        {/* <CommissionInfo /> */}
        <Flex flexDirection="column">
          <MyReferralLink />
          {/* <ClaimReward /> */}
        </Flex>
      </Flex>
    </AffiliatesProgramLayout>
  )
}

export default Dashboard
