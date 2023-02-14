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
        Lorem ipsum dolor sit amet, consectetur adipiscing elit,sed do eiusmod tempor incididunt ut
      </Text>
      <Text mb="20px" textAlign="center" color="textSubtle">
        labore et dolore magna aliqua.
      </Text>
      <Text textAlign="center" color="textSubtle" bold mb="32px">
        {t('How does it work?')}
      </Text>
      <Flex width={['280px', '280px', '280px', '888px']} flexDirection={['column', 'column', 'column', 'row']}>
        <Flex width={['100%', '100%', '100%', '33.33%']} m={['0 0 16px 0', '0 0 16px 0', '0 0 16px 0', '0 16px 0 0']}>
          <Card>
            <Box padding={['24px']}>
              <Text fontSize={['40px']} bold color="secondary">
                1
              </Text>
              <Text fontSize={['40px']} bold lineHeight="110%">
                Apply for
              </Text>
              <Text fontSize={['40px']} bold color="secondary" lineHeight="110%">
                Referral
              </Text>
              <Text fontSize={['40px']} bold color="secondary" lineHeight="110%">
                Link
              </Text>
              <Text fontSize={['14px']}>Fill out a form to apply to join our affiliate program</Text>
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
                Invite
              </Text>
              <Text fontSize={['40px']} bold color="primary" lineHeight="110%">
                Your
              </Text>
              <Text fontSize={['40px']} bold color="primary" lineHeight="110%">
                Friends
              </Text>
              <Text fontSize={['14px']}>Invite your friends using the referral link generated for you</Text>
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
              <Text fontSize={['14px']}>Receive referral rewards in CAKE from your friends’ earnings & swaps</Text>
            </Box>
          </Card>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default HowItWork
