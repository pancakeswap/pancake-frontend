import styled from 'styled-components'
import { Box, Flex, Text, Card, TwitterIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Image from 'next/image'
import Trans from 'components/Trans'

const stepList = [
  {
    title: <Trans>Look for eligible pairs</Trans>,
    subTitle: (
      <Trans>Use the hot token list on the Swap page to check which pairs are eligible for trading rewards.</Trans>
    ),
    imgUrl: '/images/trading-reward/step1.png',
  },
  {
    title: <Trans>Start trading</Trans>,
    subTitle: (
      <Trans>
        Start trading any eligible pairs to earn rewards in CAKE. The more you trade, the more rewards you will earn
        from the current reward pool.
      </Trans>
    ),
    imgUrl: '/images/trading-reward/step2.png',
  },
  {
    title: <Trans>Track your volume and rewards</Trans>,
    subTitle: <Trans>Come back to this page to check your volume and rewards in real-time.</Trans>,
    imgUrl: '/images/trading-reward/step3.png',
  },
  {
    title: <Trans>Claim your rewards</Trans>,
    subTitle: (
      <Trans>After each period ends, come back to this page and claim your rewards from the previous periods.</Trans>
    ),
    imgUrl: '/images/trading-reward/step4.png',
  },
]

const StyledCard = styled(Card)`
  width: 100%;
  background: transparent;
  > div {
    background: transparent;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    background: ${({ theme }) => theme.colors.cardBorder};
    > div {
      background: ${({ theme }) => theme.colors.backgroundAlt};
    }
  }
`

const HowToEarn = () => {
  const { t } = useTranslation()

  return (
    <Box padding="0 16px" mt={['72px', '72px', '72px', '143px']}>
      <Box margin={['auto']} width={['100%', '100%', '100%', '100%', '100%', '100%', '1140px']}>
        <StyledCard>
          <Flex flexDirection="column" padding={['50px 0 0 0', '50px 0 0 0', '50px 0 0 0', '50px 0']}>
            <Text bold mb={['24px']} color="secondary" textAlign="center" fontSize={['40px']}>
              {t('How to Earn')}
            </Text>
            <Flex flexWrap="wrap" flexDirection={['column', 'column', 'column', 'row']}>
              {stepList.map((step, index) => (
                <Flex
                  key={step.imgUrl}
                  width={['100%', '100%', '100%', '50%', '25%']}
                  flexDirection="column"
                  padding={['42px 22px', '42px 22px', '42px 22px', '0 22px']}
                >
                  <Text fontSize="12px" mb="32px" bold textAlign="right">{`Step${index + 1}`}</Text>
                  <Box margin="auto">
                    <Image src={step.imgUrl} width={180} height={180} alt={`step${index + 1}`} />
                  </Box>
                  <Text bold fontSize={['24px']} color="secondary" mb={['16px']}>
                    {step.title}
                  </Text>
                  <Text color="textSubtle">{step.subTitle}</Text>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </StyledCard>
      </Box>
      <Flex
        justifyContent="center"
        width={['226px', '226px', '226px', '100%']}
        margin={['auto', 'auto', 'auto', '42px 0 0 0 ']}
      >
        <TwitterIcon width={24} height={24} color="primary" />
        <Text textAlign={['center', 'center', 'center', 'left']} bold color="primary" ml="4px">
          {t('+Follow For New Pairs and Reward Pool Updates')}
        </Text>
      </Flex>
    </Box>
  )
}

export default HowToEarn
