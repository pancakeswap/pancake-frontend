import { Flex, Heading, Text, Card, Box } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import GradientLogo from 'views/Home/components/GradientLogoSvg'

const HowItWork = () => {
  const { t } = useTranslation()

  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
      mt={['36px', '36px', '36px', '80px']}
      mb={['168px']}
      padding="0 16px"
    >
      <GradientLogo height="36px" width="36px" mb="24px" />
      <Heading textAlign="center" scale="xl">
        {t('Good things')}
      </Heading>
      <Heading textAlign="center" scale="xl" mb="32px">
        {t('are meant to be shared')}
      </Heading>
      <Text textAlign="center" color="textSubtle">
        Turn your love and passion for PancakeSwap into rewards. Become a PancakeSwap affiliate and watch your wallet
        grow
      </Text>
      <Text textAlign="center" color="textSubtle" bold mb="32px">
        {t('How Do You Become a PancakeSwap Affiliate?')}
      </Text>
      <Flex width={['280px', '280px', '280px', '888px']} flexDirection={['column', 'column', 'column', 'row']}>
        <Flex width={['100%', '100%', '100%', '33.33%']} m={['0 0 16px 0', '0 0 16px 0', '0 0 16px 0', '0 16px 0 0']}>
          <Card style={{ width: '100%' }}>
            <Box padding={['24px']}>
              <Text fontSize={['40px']} bold color="secondary">
                1
              </Text>
              <Text fontSize={['40px']} bold lineHeight="110%">
                Submit
              </Text>
              <Text fontSize={['40px']} bold color="secondary" lineHeight="110%">
                Your
              </Text>
              <Text fontSize={['40px']} bold color="secondary" lineHeight="110%">
                Application
              </Text>
              <Text fontSize={['14px']}>It&apos;s fast, easy, and completely free!</Text>
            </Box>
          </Card>
        </Flex>
        <Flex width={['100%', '100%', '100%', '33.33%']} m={['0 0 16px 0', '0 0 16px 0', '0 0 16px 0', '0 16px 0 0']}>
          <Card>
            <Box padding={['24px']}>
              <Text fontSize={['40px']} bold color="primary">
                2
              </Text>
              <Text fontSize={['40px']} bold lineHeight="110%">
                Share
              </Text>
              <Text fontSize={['40px']} bold color="primary" lineHeight="110%">
                Your
              </Text>
              <Text fontSize={['40px']} bold color="primary" lineHeight="110%">
                Love
              </Text>
              <Text fontSize={['14px']}>
                Share your unique affiliate link with your friends, followers, and anyone who loves a good adventure
              </Text>
            </Box>
          </Card>
        </Flex>
        <Flex width={['100%', '100%', '100%', '33.33%']}>
          <Card>
            <Box padding={['24px']}>
              <Text fontSize={['40px']} bold color="failure">
                3
              </Text>
              <Text fontSize={['40px']} bold lineHeight="110%">
                Start
              </Text>
              <Text fontSize={['40px']} bold lineHeight="110%">
                Earning
              </Text>
              <Text fontSize={['40px']} bold color="failure" lineHeight="110%">
                CAKE
              </Text>
              <Text fontSize={['14px']}>Earn up to 20% referral commissions in CAKE</Text>
            </Box>
          </Card>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default HowItWork
