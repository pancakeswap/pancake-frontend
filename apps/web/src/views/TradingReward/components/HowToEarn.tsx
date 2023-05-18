import styled from 'styled-components'
import { Box, Flex, Text, Card, LinkExternal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Image from 'next/image'
import Trans from 'components/Trans'

const stepList = [
  {
    title: <Trans>Look for eligible pairs</Trans>,
    subTitle: (
      <Trans>Use the hot token list on the Swap page to check which pairs are eligible for trading rewards.</Trans>
    ),
    imgUrl: '/images/trading-reward/step1-1.png',
  },
  {
    title: <Trans>Start trading</Trans>,
    subTitle: (
      <Trans>
        Start trading any eligible pairs to earn rewards in CAKE. The more you trade, the more rewards you will earn
        from the current reward pool.
      </Trans>
    ),
    imgUrl: '/images/trading-reward/step2-1.png',
  },
  {
    title: <Trans>Track your volume and rewards</Trans>,
    subTitle: <Trans>Come back to this page to check your volume and rewards in real-time.</Trans>,
    imgUrl: '/images/trading-reward/step3-1.png',
  },
  {
    title: <Trans>Claim your rewards</Trans>,
    subTitle: (
      <Trans>After each period ends, come back to this page and claim your rewards from the previous periods.</Trans>
    ),
    imgUrl: '/images/trading-reward/step4-1.png',
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
    <Box id="howToEarn" padding="0 16px" m={['72px 0', '72px 0', '72px 0', '143px 0 108px 0']}>
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
                  <Flex
                    flexDirection={['column-reverse', 'column-reverse', 'column-reverse', 'column-reverse', 'column']}
                  >
                    <Text
                      fontSize="12px"
                      bold
                      textAlign={['left', 'left', 'left', 'left', 'right']}
                      m={['0 0 8px 0', '0 0 8px 0', '0 0 8px 0', '0 0 8px 0', '0 0 32px 0']}
                    >
                      {`Step ${index + 1}`}
                    </Text>
                    <Box margin="0 auto">
                      <Image src={step.imgUrl} width={180} height={180} alt={`step${index + 1}`} />
                    </Box>
                  </Flex>
                  <Text lineHeight="110%" bold fontSize={['24px']} color="secondary" mb={['16px']}>
                    {step.title}
                  </Text>
                  <Text color="textSubtle">{step.subTitle}</Text>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </StyledCard>
      </Box>
      <LinkExternal
        external
        href="https://docs.pancakeswap.finance/products/trading-reward/how-to-participate"
        margin={['auto', 'auto', 'auto', '42px auto 0 auto']}
      >
        {t('Learn More')}
      </LinkExternal>
    </Box>
  )
}

export default HowToEarn
