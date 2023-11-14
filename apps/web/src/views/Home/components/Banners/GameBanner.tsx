import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Link, OpenNewIcon, Text, useMatchBreakpoints, Button } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import Image from 'next/legacy/image'
import { memo } from 'react'
import { styled, keyframes } from 'styled-components'
import * as S from './Styled'
import { gameDesktopBg, gameMobileBunny, gameDesktopBunny, gameCube, gameText, gameMobileText } from './images'

const flyingAnim = keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(-5px, 5px);
  }
  to {
    transform: translate(0, 0px);
  }
`

const pancakeSwapLogo = `${ASSET_CDN}/web/banners/ethXpancakeswap.png`

const RightWrapper = styled.div`
  position: absolute;
  min-height: 100%;
  width: 100%;
  right: 0;
  bottom: -2px;
  z-index: 2;

  > span:first-child {
    position: absolute !important;
    top: -20px;
    left: 70%;
    z-index: 3;
    animation: ${flyingAnim} 2.5s ease-in-out infinite;

    ${({ theme }) => theme.mediaQueries.lg} {
      left: 58%;
    }
  }

  > span:nth-child(2) {
    position: absolute !important;
    right: 0;
    bottom: 2px;
    z-index: 2;

    ${({ theme }) => theme.mediaQueries.lg} {
      right: 8%;
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
  font-family: 'Kanit';
  font-style: normal;
  font-weight: 800;
  font-size: 24px;
  line-height: 98%;
  letter-spacing: 0.01em;
  font-feature-settings: 'liga' off;
  background: linear-gradient(28deg, #ffb237 -0.47%, #ffeb37 54.35%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-left: 3px;

  &::after {
    letter-spacing: 0.01em;
    background: linear-gradient(28deg, #ffb237 -0.47%, #ffeb37 54.35%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    content: attr(data-text);
    text-shadow: -1.1px -1.1px 0px rgba(52, 251, 166, 1);
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    padding-right: 100px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 33px;
  }
`

const GradientText = styled(Text)<{ backgroundColor?: string }>`
  font-size: 19.823px;
  font-weight: 800;
  line-height: 105%;
  letter-spacing: 0.496px;
  background-clip: text;
  background: ${({ backgroundColor }) => backgroundColor};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const GameBanner = () => {
  const { t, currentLanguage } = useTranslation()
  const { isMobile, isDesktop } = useMatchBreakpoints()

  return (
    <S.Wrapper
      style={{
        background: `linear-gradient(140deg, #313D5C 0%, #3D2A54 100%)`,
      }}
    >
      <S.Inner>
        <S.LeftWrapper position="relative" style={{ zIndex: 3, justifyContent: isMobile ? 'flex-start' : 'center' }}>
          <Flex alignItems="center" mb="8px" style={{ gap: isMobile ? 8 : 10 }}>
            <Image
              src={pancakeSwapLogo}
              alt="pancakeSwapLogo"
              width={isMobile ? 100 : 132}
              height={isMobile ? 15 : 22}
              unoptimized
            />
          </Flex>
          <Header data-text={isMobile ? t('Gaming Marketplace') : t('PancakeSwap Gaming Marketplace')}>
            {isMobile ? t('Gaming Marketplace') : t('PancakeSwap Gaming Marketplace')}
          </Header>
          <Box>
            {isDesktop ? (
              <Flex mt="8px">
                <GradientText backgroundColor="#34FBA6" mr="4px">
                  {t('Explore Your')}
                </GradientText>
                {currentLanguage.code === 'en' ? (
                  <Box m="4px 4px 0 0">
                    <Image src={gameText} alt="gameText" width={177} height={19} placeholder="blur" />
                  </Box>
                ) : (
                  <>
                    <GradientText backgroundColor="#88FF5C 120%">{t('GameFi Spirit')}</GradientText>
                    <Text as="span" m="0 2px">
                      💚
                    </Text>
                  </>
                )}
                <GradientText backgroundColor="linear-gradient(90deg, #88FF5C 10.97%, #F4E23B 27.39%, #FFDF38 99.79%)">
                  {t('1.5M Monthly Players Await!')}
                </GradientText>
              </Flex>
            ) : (
              <>
                {currentLanguage.code === 'en' ? (
                  <Box mt="8px">
                    <Image src={gameMobileText} alt="gameMobileText" width={84} height={20} placeholder="blur" />
                  </Box>
                ) : (
                  <Text fontSize={20} bold color="#05FFC3">
                    {t('is Live')}
                  </Text>
                )}
              </>
            )}
          </Box>
          <Link style={{ textDecoration: 'none' }} external href="https://pancakeswap.games/">
            <Button variant="text" pl="0px" pt="0px" scale={isMobile ? 'sm' : 'md'}>
              <Text textTransform={isMobile ? 'uppercase' : 'capitalize'} bold fontSize="16px" color="#05FFC3">
                {t('Try Now')}
              </Text>
              <OpenNewIcon color="#05FFC3" />
            </Button>
          </Link>
        </S.LeftWrapper>
        <RightWrapper>
          <Image src={gameCube} alt="gameCube" width={52} height={52} placeholder="blur" />
          {isDesktop ? (
            <Image src={gameDesktopBunny} alt="gameDesktopBunny" width={264.5} height={192} placeholder="blur" />
          ) : (
            <Image src={gameMobileBunny} alt="gameMobileBunny" width={338} height={176} placeholder="blur" />
          )}
          <BgWrapper>
            {isDesktop && <Image src={gameDesktopBg} alt="gameBg" width={1126} height={192} placeholder="blur" />}
          </BgWrapper>
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default memo(GameBanner)
