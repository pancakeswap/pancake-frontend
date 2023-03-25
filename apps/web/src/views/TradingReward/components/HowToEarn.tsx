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

const HowToEarn = () => {
  const { t } = useTranslation()

  return (
    <Box mt={['143px']}>
      <Box width={['1140px']} margin={['auto']}>
        <Card style={{ width: '100%' }}>
          <Flex padding={['50px 0']} flexDirection="column">
            <Text bold mb={['24px']} color="secondary" textAlign="center" fontSize={['40px']}>
              {t('How to Earn')}
            </Text>
            <Flex>
              {stepList.map((step, index) => (
                <Flex key={step.imgUrl} width={['25%']} flexDirection="column" padding={['0 22px']}>
                  <Text fontSize="12px" mb="32px" bold textAlign="right">{`Step${index + 1}`}</Text>
                  <Image src={step.imgUrl} width={180} height={180} alt={`step${index + 1}`} />
                  <Text bold fontSize={['24px']} color="primary" mb={['16px']}>
                    {step.title}
                  </Text>
                  <Text color="textSubtle">{step.subTitle}</Text>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </Card>
      </Box>
      <Flex justifyContent="center" mt="42px">
        <TwitterIcon width={24} height={24} color="primary" />
        <Text bold color="primary" ml="4px">
          {t('+Follow For New Pairs and Reward Pool Updates')}
        </Text>
      </Flex>
    </Box>
  )
}

export default HowToEarn
