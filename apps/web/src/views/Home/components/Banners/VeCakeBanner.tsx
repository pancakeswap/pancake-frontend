import { useTranslation } from '@pancakeswap/localization'
import { ArrowForwardIcon, Box, Button, Flex, Link, OpenNewIcon, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import Image from 'next/legacy/image'
import { memo } from 'react'
import { keyframes, styled } from 'styled-components'
import * as S from './Styled'
import { vecakeBg, vecakeDesktopBunny, vecakeMobileBg, vecakeMobileBunny, vecakeRuby, vecakeTitle } from './images'

const flyingAnim = keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(0px, 7px);
  }
  to {
    transform: translate(0, 0px);
  }
`

const StyledButton = styled(Button)`
  margin-top: 16px;
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  padding: 4px 12px;
  border-radius: 16px;
  height: auto;

  ${({ theme }) => theme.mediaQueries.md} {
    border-radius: 16px;
    height: 48px;
    padding: 4px 24px;
  }
`

const RightWrapper = styled.div`
  position: absolute;
  min-height: 100%;
  width: 100%;
  right: 0;
  bottom: -2px;
  z-index: 2;

  > span:first-child {
    position: absolute !important;
    top: -30px;
    left: 70%;
    z-index: 3;
    animation: ${flyingAnim} 2.5s ease-in-out infinite;
    display: none !important;

    ${({ theme }) => theme.mediaQueries.lg} {
      left: 58%;
      display: inline-block !important;
    }
  }

  > span:nth-child(2) {
    position: absolute !important;
    right: 1%;
    z-index: 2;
    bottom: 42px;

    ${({ theme }) => theme.mediaQueries.sm} {
      right: 6%;
      bottom: 2px;
    }

    ${({ theme }) => theme.mediaQueries.md} {
      right: 10%;
      bottom: 2px;
    }
    ${({ theme }) => theme.mediaQueries.lg} {
      right: 12%;
      bottom: 2px;
    }
  }
`

const BgWrapper = styled.div`
  position: absolute;
  right: 0px;
  top: -2px;
  overflow: hidden;
  height: 100%;
  border-radius: 32px;
  z-index: 1;

  > span:first-child {
    position: relative !important;
    right: 0px;
    top: 0px;
    height: 100% !important;
  }
`
const Header = styled.div`
  padding-right: 100px;
  position: relative;
  font-feature-settings: 'liga' off;
  font-family: Kanit;
  font-size: 20px;
  font-style: normal;
  font-weight: 900;
  line-height: 105%;
  letter-spacing: 0.2px;
  font-feature-settings: 'liga' off;
  background: linear-gradient(180deg, #ffb237 0%, #ffeb37 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 6px;
  width: 100%;

  &::after {
    letter-spacing: 0.01em;
    background: linear-gradient(166.02deg, #ffb237 -5.1%, #ffeb37 75.24%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    content: attr(data-text);
    text-shadow: 1.27551px 1.27551px 1.02041px rgba(0, 0, 0, 0.2);
    -webkit-text-stroke: 3px #7645d9;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    padding-right: 100px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 80%;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 28px;
    width: 100%;
    letter-spacing: 0.28px;

    &::after {
      -webkit-text-stroke: 6px #7645d9;
    }
  }
`

const SubText = styled(Text)`
  font-size: 24px;
  font-family: Kanit;
  font-weight: 800;
  line-height: 24px;
`

const VeCakeBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isDesktop } = useMatchBreakpoints()

  return (
    <S.Wrapper
      style={{
        background: isMobile
          ? 'radial-gradient(92.34% 120.46% at -7.78% 8.16%, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.00) 100%), radial-gradient(181.99% 148.11% at 96.81% -4.27%, #9AEDFF 0%, #CCC2FE 73.24%, #C6A3FF 100%)'
          : 'linear-gradient(285deg, rgba(155, 108, 218, 0.22) 1.42%, rgba(155, 108, 218, 0.00) 49.66%), linear-gradient(239deg, rgba(189, 217, 255, 0.44) 20.76%, rgba(198, 200, 254, 0.44) 82.65%), radial-gradient(321.2% 159.12% at 28.24% 7.18%, #CBEDEF 0%, #A3A9D5 72.82%, #9A9FD0 100%)',
      }}
    >
      <S.Inner>
        <S.LeftWrapper position="relative" style={{ zIndex: 3, justifyContent: isMobile ? 'flex-start' : 'center' }}>
          <Flex alignItems="center" mb="8px" style={{ gap: isMobile ? 8 : 10 }}>
            <Image
              src={vecakeTitle}
              alt="pancakeSwapLogo"
              width={isMobile ? 100 : 132}
              height={isMobile ? 15 : 22}
              unoptimized
            />
          </Flex>
          <Header data-text={isMobile ? t('Introducing Gauges Voting and veCAKE') : t('Your CAKE, Your Voice')}>
            {isMobile ? t('Introducing Gauges Voting and veCAKE') : t('Your CAKE, Your Voice')}
          </Header>
          <Box>
            {isDesktop ? (
              <Flex mt="8px">
                <SubText color="#7645D9" mr="4px">
                  {t('Introducing')}
                </SubText>

                <SubText color="#280D5F" mr="4px">
                  {t('Gauges Voting')}
                </SubText>

                <SubText color="#7645D9" mr="4px">
                  {t('and')}
                </SubText>
                <SubText color="#280D5F" mr="4px">
                  {t('veCAKE')}
                </SubText>
              </Flex>
            ) : null}
          </Box>
          {isDesktop ? (
            <Flex style={{ gap: isMobile ? 4 : 16 }}>
              <NextLinkFromReactRouter to="/cake-staking" prefetch={false}>
                <StyledButton scale={isMobile ? 'sm' : 'md'}>
                  <Text
                    textTransform={isMobile ? 'uppercase' : 'capitalize'}
                    bold
                    color="invertedContrast"
                    fontSize={isMobile ? '12px' : '16px'}
                    mr="4px"
                  >
                    {t('Get Started')}
                  </Text>
                  {!isMobile && <ArrowForwardIcon color="invertedContrast" />}
                </StyledButton>
              </NextLinkFromReactRouter>
              <Link
                href="https://blog.pancakeswap.finance/articles/introducing-gauges-voting-and-ve-cake-your-ownership-of-cake-emissions"
                external
                style={{ textDecoration: 'none' }}
              >
                <StyledButton variant="tertiary" style={{ background: 'white' }} scale={isMobile ? 'sm' : 'md'}>
                  <Text
                    color="primary"
                    bold
                    fontSize={isMobile ? '12px' : '16px'}
                    textTransform={isMobile ? 'uppercase' : 'capitalize'}
                    mr="4px"
                  >
                    {t('Learn More')}
                  </Text>
                </StyledButton>
              </Link>
            </Flex>
          ) : (
            <Link href="/cake-staking" external style={{ textDecoration: 'none' }}>
              <StyledButton>
                <Text
                  bold
                  color="invertedContrast"
                  fontSize={isMobile ? '12px' : '16px'}
                  textTransform={isMobile ? 'uppercase' : 'capitalize'}
                  mr="4px"
                >
                  {t('get started')}
                </Text>
                <OpenNewIcon color="invertedContrast" />
              </StyledButton>
            </Link>
          )}
        </S.LeftWrapper>
        <RightWrapper>
          <Image src={vecakeRuby} alt="vecakeRuby" width={73.52} height={77.7} placeholder="blur" />
          {isMobile ? (
            <Image src={vecakeMobileBunny} alt="vecakeMobileBunny" width={161} height={177.7} placeholder="blur" />
          ) : (
            <Image src={vecakeDesktopBunny} alt="vecakeDesktopBunny" width={234.5} height={257.46} placeholder="blur" />
          )}
          <BgWrapper>
            {isMobile ? (
              <Image src={vecakeMobileBg} alt="vecakeBg" placeholder="blur" />
            ) : (
              <Image src={vecakeBg} alt="vecakeBg" width={1126} height={192} placeholder="blur" />
            )}
          </BgWrapper>
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default memo(VeCakeBanner)
