import { Trans, useTranslation } from '@pancakeswap/localization'
import { Box, Card, Flex, Heading, PageSection, Text } from '@pancakeswap/uikit'
import { Decorations } from 'components/Game/Developers/Decorations'
import GradientLogo from 'components/Game/GradientLogoSvg'
import { DARK_BG, LIGHT_BG } from 'components/Game/pageSectionStyles'
import { ASSET_CDN } from 'config/constants/endpoints'
import Image from 'next/image'
import { styled } from 'styled-components'

const StyledContainer = styled(PageSection)`
  padding: 0px 16px 24px 16px;
  background: ${({ theme }) => (theme.isDark ? DARK_BG : LIGHT_BG)};

  ${({ theme }) => theme.mediaQueries.xl} {
    padding: 89px 24px 24px 24px;
  }
`

const StyledList = styled(Flex)`
  flex-direction: column;
  max-width: 312px;
  margin: 0 auto 12px auto;

  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 282px;
    margin: 0 0 12px 0;
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    margin: 0 24px 0 0;
  }
`

const StyledCard = styled(Card)`
  max-width: 282px;
  margin: 0 0 16px 0;

  ${StyledList} {
    padding: 24px;
    margin: 0;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    margin: 0 16px 16px 0;
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    margin: 0;
  }
`

const StyledGameBenefitsListContainer = styled(Flex)`
  width: 312px;
  flex-wrap: wrap;
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 588px;
    justify-content: space-between;
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

  ${StyledCard} {
    ${({ theme }) => theme.mediaQueries.md} {
      &:nth-child(even) {
        margin-right: 0;
      }
    }
  }
`

const GameBenefitsList = [
  {
    title: <Trans>Connect with a 1.5 Million Ready-to-Play Community</Trans>,
    desc: <Trans>Join the community and create games with infinite possibilities</Trans>,
    imgUrl: `${ASSET_CDN}/web/game/developers/bring-your-game-1-1.png`,
  },
  {
    title: <Trans>Elevate Your Games with Real Utility</Trans>,
    desc: <Trans>Integrate CAKE tokens and NFTs to enrich the gaming experience</Trans>,
    imgUrl: `${ASSET_CDN}/web/game/developers/bring-your-game-2-1.png`,
  },
  {
    title: <Trans>Partner with the Leading Brand in the Industry</Trans>,
    desc: <Trans>Build Games with the most reputable global brand in the industry</Trans>,
    imgUrl: `${ASSET_CDN}/web/game/developers/bring-your-game-3-1.png`,
  },
  {
    title: <Trans>Explore Top Blockchains</Trans>,
    desc: <Trans>PancakeSwap operates on 9 popular blockchains, welcoming developers from diverse ecosystems</Trans>,
    imgUrl: `${ASSET_CDN}/web/game/developers/bring-your-game-4.png`,
  },
]

const InfrastructureList = [
  {
    title: <Trans>Maximum Security Assurance</Trans>,
    desc: <Trans>Ensuring maximum protection for your games</Trans>,
  },
  {
    title: <Trans>Consistent Uptime</Trans>,
    desc: <Trans>Reliable service for your uninterrupted operations</Trans>,
  },
  {
    title: <Trans>Access Top-Tier Industry and Expertise</Trans>,
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
    <Box position="relative">
      <Decorations />
      <StyledContainer
        index={2}
        concaveDivider
        dividerPosition="top"
        clipFill={{ light: '#FFF', dark: '#191326' }}
        containerProps={{ style: { marginTop: '-30px' } }}
      >
        <Flex pt={['0', '0', '0', '0', '24px']} alignItems="center" flexDirection="column" justifyContent="center">
          <GradientLogo height="36px" width="36px" mb="24px" />
          <Heading maxWidth={['745px']} textAlign="center" scale="xl" mb="32px">
            {t('Bring Your Game to Life on PancakeSwap')}
          </Heading>
          <StyledGameBenefitsListContainer>
            {GameBenefitsList.map((benefit, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <StyledList key={`benefit-${index}`}>
                <Box m={['auto', 'auto', 'auto', 'auto', '0']}>
                  <Image width={240} height={240} src={benefit.imgUrl} alt="" />
                </Box>
                <Text
                  lineHeight="110%"
                  mt={['8px', '8px', '8px', '8px', '24px']}
                  bold
                  fontSize={['20px']}
                  color="secondary"
                  mb="8px"
                >
                  {benefit.title}
                </Text>
                <Text lineHeight="110%" mb={['28px', '28px', '28px', '28px', '0']} bold fontSize={['20px']}>
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
                  <Text lineHeight="110%" bold fontSize={['24px']} mb="16px">
                    {infrastructure.title}
                  </Text>
                  <Text lineHeight="120%" fontSize={['14px']} color="textSubtle">
                    {infrastructure.desc}
                  </Text>
                </StyledList>
              </StyledCard>
            ))}
          </StyledGameBenefitsListContainer>
        </Flex>
      </StyledContainer>
    </Box>
  )
}
