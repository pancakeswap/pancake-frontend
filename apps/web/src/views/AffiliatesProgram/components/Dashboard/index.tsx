import { Flex, Box, Card } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { useTranslation } from '@pancakeswap/localization'
import AffiliatesProgramLayout from 'views/AffiliatesProgram/components/AffiliatesProgramLayout'
import Banner from 'views/AffiliatesProgram/components/Dashboard/Banner'
import MyReferralLink from 'views/AffiliatesProgram/components/Dashboard/MyReferralLink'
import useAuthAffiliate from 'views/AffiliatesProgram/hooks/useAuthAffiliate'
import useAuthAffiliateExist from 'views/AffiliatesProgram/hooks/useAuthAffiliateExist'
import useUserInfo from 'views/AffiliatesProgram/hooks/useUserInfo'
import ConnectWalletButton from 'components/ConnectWalletButton'
import LoginButton from 'views/AffiliatesProgram/components/Dashboard/LoginButton'
import CommissionInfo from 'views/AffiliatesProgram/components/Dashboard/CommissionInfo'
import Reward from 'views/AffiliatesProgram/components/Dashboard/Reward'
import AffiliateLinks from 'views/AffiliatesProgram/components/Dashboard/AffiliateLinks'

const Dashboard = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { isAffiliate, affiliate, refresh } = useAuthAffiliate()
  const { isAffiliateExist } = useAuthAffiliateExist()
  const { userInfo } = useUserInfo()

  return (
    <AffiliatesProgramLayout>
      <Banner title={t('Dashboard')} subTitle={t('Manage your affiliate link, see how much you’ve earned')} />
      {!account ? (
        <ConnectWalletButton display="block" m="40px auto" />
      ) : (
        <Flex
          padding="0 16px"
          m={['24px 0', '24px 0', '24px 0', '68px 0 24px 0']}
          justifyContent={['center']}
          flexDirection={['column', 'column', 'column', 'column', 'column', 'row']}
        >
          {isAffiliate && <CommissionInfo affiliate={affiliate} />}
          <Flex
            flexDirection="column"
            width={['100%', '100%', '100%', '100%', '100%', '700px']}
            m={['32px 0 0 0', '32px 0 0 0', '32px 0 0 0', '32px 0 0 0', '32px 0 0 0', '0 0 0 32px']}
          >
            <Card mb="16px">
              {isAffiliateExist && (
                <Box padding={['24px']}>
                  {!isAffiliate ? (
                    <LoginButton />
                  ) : (
                    <>
                      <MyReferralLink affiliate={affiliate} refreshAffiliateInfo={refresh} />
                      <AffiliateLinks affiliate={affiliate} />
                    </>
                  )}
                </Box>
              )}
              <Reward
                isAffiliate={isAffiliate}
                userRewardFeeUSD={userInfo.availableFeeUSD}
                affiliateRewardFeeUSD={affiliate.availableFeeUSD}
                refreshAuthAffiliate={refresh}
              />
            </Card>
          </Flex>
        </Flex>
      )}
    </AffiliatesProgramLayout>
  )
}

Dashboard.chains = []

export default Dashboard
