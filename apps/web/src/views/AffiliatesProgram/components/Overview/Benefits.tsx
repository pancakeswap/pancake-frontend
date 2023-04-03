import { Flex, Text, Heading, PageSection } from '@pancakeswap/uikit'
import { useTranslation, Trans } from '@pancakeswap/localization'
import GradientLogo from 'views/Home/components/GradientLogoSvg'
import styled from 'styled-components'
import Image from 'next/image'

const StyledList = styled(Flex)`
  margin-top: 24px;
  flex-direction: column;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.md} {
    align-items: flex-start;
    margin-top: 48px;
    flex-direction: row;
  }
`

const StyledContainer = styled(Flex)`
  max-width: 723px;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.md} {
    ${StyledList} {
      &:nth-child(even) {
        flex-direction: row-reverse;
      }
    }
  }
`

const BenefitsList = [
  {
    title: <Trans>Partner with the Leading Brand in the Industry</Trans>,
    desc: (
      <Trans>
        Forge a partnership with the most reputable global brand in the industry to make DeFi accessible and better for
        everyone
      </Trans>
    ),
    imgUrl: '/images/affiliates-program/partner.png',
  },
  {
    title: <Trans>User Friendly Platform</Trans>,
    desc: <Trans>Provide a seamless experience for your referrals with our user friendly platform</Trans>,
    imgUrl: '/images/affiliates-program/user-friendly-platform.png',
  },
  {
    title: <Trans>Customize Profit-Sharing</Trans>,
    desc: <Trans>Share the rewards with your community</Trans>,
    imgUrl: '/images/affiliates-program/profit-sharing.png',
  },
  {
    title: <Trans>Real-Time Reporting</Trans>,
    desc: <Trans>Easily keep tabs on commission and earnings with our user-friendly dashboard</Trans>,
    imgUrl: '/images/affiliates-program/real-time-reporting.png',
  },
  {
    title: <Trans>Personalized Support</Trans>,
    desc: <Trans>Personalized assistance from our community managers</Trans>,
    imgUrl: '/images/affiliates-program/personalized-support.png',
  },
]

const Benefits = () => {
  const { t } = useTranslation()

  return (
    <PageSection
      index={1}
      dividerPosition="top"
      clipFill={{
        light: 'linear-gradient(139.73deg, #E9F6FF 0%, #F1EEFF 100%)',
        dark: 'linear-gradient(135deg, #2F2E4D 0%, #362649 100%)',
      }}
      innerProps={{ style: { padding: '0 16px' } }}
    >
      <Flex alignItems="center" flexDirection="column" justifyContent="center">
        <GradientLogo height="36px" width="36px" mb="24px" />
        <Heading maxWidth={['700px']} textAlign="center" scale="xl">
          {t('Unlock the Power of PancakeSwap Affiliate Benefits')}
        </Heading>
        <StyledContainer>
          {BenefitsList.map((benefit, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <StyledList key={`benefit-${index}`}>
              <Image width={220} height={180} src={benefit.imgUrl} alt="" />
              <Flex
                m={['0 32px']}
                alignSelf={['center']}
                flexDirection="column"
                alignItems={['center', 'center', 'center', 'flex-start']}
              >
                <Text fontSize={['32px']} bold color="secondary" mb={['12px', '12px', '12px', '24px']}>
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
