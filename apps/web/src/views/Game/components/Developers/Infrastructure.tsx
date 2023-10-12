import { styled } from 'styled-components'
import { useTranslation, Trans } from '@pancakeswap/localization'
import { Box, Flex, Text, Heading, Card } from '@pancakeswap/uikit'
import Image from 'next/image'
import GradientLogo from 'views/Home/components/GradientLogoSvg'

const StyledContainer = styled(Box)`
  padding: 89px 16px 24px 16px;
  background: ${({ theme }) =>
    theme.isDark
      ? ' radial-gradient(105.94% 70.71% at 50% 50%, #21193A 0%, #191326 100%)'
      : 'linear-gradient(180deg, #FFF 0%, #FAF9FA 48.15%, #D7CAEC 100%)'};
`

const StyledList = styled(Flex)`
  flex-direction: column;
  max-width: 282px;
  margin: 0 0 12px 0;

  ${({ theme }) => theme.mediaQueries.xxl} {
    margin: 0 24px 0 0;
  }
`

const StyledGameBenefitsListContainer = styled(Flex)`
  width: 282px;
  flex-wrap: wrap;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 588px;
  }
  ${({ theme }) => theme.mediaQueries.xxl} {
    width: 1200px;
  }

  ${StyledList} {
    &:nth-child(4) {
      ${({ theme }) => theme.mediaQueries.xxl} {
        margin: 0;
      }
    }
  }
`

const StyledCard = styled(Card)`
  maxwidth: 282px;
  alignself: flex-start;
  margin: 0 0 16px 0;

  ${StyledList} {
    padding: 24px;
    margin: 0;
  }
`

const GameBenefitsList = [
  {
    title: <Trans>PConnect with a 1.5 Million Ready-to-Play Community</Trans>,
    desc: <Trans>Join the community and create games with infinite possibilities</Trans>,
    imgUrl: '/images/game/developers/bring-your-game-1.png',
  },
  {
    title: <Trans>Elevate Your Games with Real Utility</Trans>,
    desc: <Trans>Integrate CAKE tokens and NFTs to enrich the gaming experience</Trans>,
    imgUrl: '/images/game/developers/bring-your-game-2.png',
  },
  {
    title: <Trans>Partner with the Leading Brand in the Industry</Trans>,
    desc: <Trans>Build Games with the most reputable global brand in the industry</Trans>,
    imgUrl: '/images/game/developers/bring-your-game-3.png',
  },
  {
    title: <Trans>Explore Top Blockchains</Trans>,
    desc: <Trans>PancakeSwap operates on 10 popular blockchains, welcoming developers from diverse ecosystems</Trans>,
    imgUrl: '/images/game/developers/bring-your-game-4.png',
  },
]

const InfrastructureList = [
  {
    title: <Trans>Maximum Security Assurance</Trans>,
    desc: <Trans>Ensuring maximum protection for your games</Trans>,
  },
  {
    title: <Trans>Consistent 99.99% Uptime</Trans>,
    desc: <Trans>Reliable Service for your uninterrupted operations</Trans>,
  },
  {
    title: <Trans>Access Top-Tier Industry Talent and Expertise</Trans>,
    desc: <Trans>Guidance from the leading DEX in the industry</Trans>,
  },
  {
    title: <Trans>Most User-Friendly UX in DeFi</Trans>,
    desc: <Trans>Elevate your user experiences to new heights</Trans>,
  },
]

export const Infrastructure = () => {
  const { t } = useTranslation()
  return (
    <StyledContainer>
      <Flex pt="24px" alignItems="center" flexDirection="column" justifyContent="center">
        <GradientLogo height="36px" width="36px" mb="24px" />
        <Heading maxWidth={['745px']} textAlign="center" scale="xl" mb="32px">
          {t('Bring Your Game to Life on PancakeSwap')}
        </Heading>
        <StyledGameBenefitsListContainer>
          {GameBenefitsList.map((benefit, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <StyledList key={`benefit-${index}`}>
              <Image width={240} height={240} src={benefit.imgUrl} alt="" />
              <Text mt="24px" bold fontSize={['20px']} color="secondary" mb="8px">
                {benefit.title}
              </Text>
              <Text bold fontSize={['20px']}>
                {benefit.desc}
              </Text>
            </StyledList>
          ))}
        </StyledGameBenefitsListContainer>
      </Flex>

      <Flex
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
        m={['72px 0 0 0', '72px 0 0 0', '72px 0 0 0', '120px 0 89px 0']}
      >
        <Heading maxWidth={['745px']} textAlign="center" scale="xl" mb="32px">
          {t('Your Complete Developer Infrastructure')}
        </Heading>
        <StyledGameBenefitsListContainer>
          {InfrastructureList.map((infrastructure, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <StyledCard key={`infrastructure-${index}`}>
              <StyledList>
                <Text bold fontSize={['24px']} mb="16px">
                  {infrastructure.title}
                </Text>
                <Text fontSize={['14px']} color="textSubtle">
                  {infrastructure.desc}
                </Text>
              </StyledList>
            </StyledCard>
          ))}
        </StyledGameBenefitsListContainer>
      </Flex>
    </StyledContainer>
  )
}
