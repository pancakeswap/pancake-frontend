import { Flex, Text, Heading, PageSection } from '@pancakeswap/uikit'
import { useTranslation, Trans } from '@pancakeswap/localization'
import GradientLogo from 'views/Home/components/GradientLogoSvg'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import Image from 'next/image'

const StyledList = styled(Flex)`
  margin-top: 48x;
`

const StyledContainer = styled(Flex)`
  maxwidth: 723px;
  flex-direction: column;

  ${StyledList} {
    &:nth-child(even) {
      flex-direction: row-reverse;
    }
  }
`

const BenefitsList = [
  {
    title: <Trans>High Commission Rates</Trans>,
    desc: <Trans>Earn up to 3% of user trading fees on every successful referral.</Trans>,
    imgUrl: '/images/affiliates-program/high-commission-rates.png',
  },
  {
    title: <Trans>User-Friendly Platform</Trans>,
    desc: <Trans>Give your referrals a smooth and hassle-free experience with our user-friendly platform</Trans>,
    imgUrl: '/images/affiliates-program/user-friendly-platform.png',
  },
  {
    title: <Trans>Profit-Sharing</Trans>,
    desc: <Trans>Share a percentage of rewards with your friends and followers</Trans>,
    imgUrl: '/images/affiliates-program/profit-sharing.png',
  },
  {
    title: <Trans>Real-Time Reporting</Trans>,
    desc: <Trans>Stay up-to-date with an easy-to-use dashboard to track your earnings and performance</Trans>,
    imgUrl: '/images/affiliates-program/real-time-reporting.png',
  },
  {
    title: <Trans>Personalized Support</Trans>,
    desc: <Trans>Our dedicated team of community manager is here to help support you</Trans>,
    imgUrl: '/images/affiliates-program/personalized-support.png',
  },
]

const Benefits = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <PageSection index={1} dividerPosition="top" clipFill={{ light: theme.colors.gradientBubblegum }}>
      <Flex alignItems="center" flexDirection="column" justifyContent="center">
        <GradientLogo height="36px" width="36px" mb="24px" />
        <Heading width={['700px']} textAlign="center" scale="xl">
          {t('Unlock the Power of PancakeSwap: Become an Affiliate Now')}
        </Heading>
        <Text color="textSubtle" margin={['48px 0']}>
          With a wide variety of cryptocurrency options and user-friendly platform, you&aposll be able to offer your
          audience a seamless investment experience.
        </Text>
        <StyledContainer>
          {BenefitsList.map((benefit, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <StyledList key={`benefit-${index}`}>
              <Image width={220} height={180} src={benefit.imgUrl} alt="" />
              <Flex m={['0 32px']} alignSelf={['center']} flexDirection="column">
                <Text fontSize={['32px']} bold color="secondary" mb="24px">
                  {benefit.title}
                </Text>
                <Text color="textSubtle">{benefit.desc}</Text>
              </Flex>
            </StyledList>
          ))}
        </StyledContainer>
      </Flex>
    </PageSection>
  )
}

export default Benefits
