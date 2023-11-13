import { Button, Flex, Text, useMatchBreakpoints, OpenNewIcon } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'

import { useTranslation } from '@pancakeswap/localization'
import Image from 'next/legacy/image'
import { styled, css } from 'styled-components'

import { ASSET_CDN } from 'config/constants/endpoints'

import { polygonZkBunny, polygonZkBgMobile, polygonZkBg } from './images'
import * as S from './Styled'
import { flyingAnim } from './animations'

const pancakeSwapLogo = `${ASSET_CDN}/web/banners/ethXpancakeswap.png`

const RightWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  right: 0;
  top: 0;
  overflow: visible;

  > span:nth-child(2) {
    // TradingRewardButter2
    position: absolute !important;
    right: 6%;
    top: -30%;
    animation: ${flyingAnim} 2.5s ease-in-out infinite;
    z-index: 2;

    ${({ theme }) => theme.mediaQueries.md} {
      right: 17%;
      top: -50%;
    }
  }
`

const Title = styled.div`
  position: relative;
  font-family: 'Kanit';
  font-style: normal;
  line-height: 98%;
  letter-spacing: 0.01em;
  font-feature-settings: 'liga' off;
  background: linear-gradient(166.02deg, #ffb237 -5.1%, #ffeb37 75.24%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 16px;
  width: 196px;

  &::after {
    letter-spacing: 0.01em;
    font-feature-settings: 'liga' off;
    background: linear-gradient(0deg, #832e00, #832e00), linear-gradient(18.74deg, #ffdf37 7.81%, #ffeb37 81.03%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    content: attr(data-text);
    text-shadow: 1.27551px 1.27551px 1.02041px rgba(0, 0, 0, 0.2);
    -webkit-text-stroke: 4px #832e00;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 32px;
    margin-bottom: 4px;
    width: 100%;
  }
`

const sharedStyle = css`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  padding: 6px 12px;
  border-radius: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    border-radius: 16px;
    padding: 12px 24px;
  }
`

const StyledButtonLeft = styled(Button)`
  ${sharedStyle}
  > div {
    color: ${({ theme }) => theme.colors.white};
  }
`

const BGWrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: -2px;
  left: 0;
  overflow: hidden;
  border-radius: 32px;
  span {
    // liquidStakingBunnyBg1
    position: absolute !important;
    top: 0px;
    right: 0px;
    max-width: none !important;
    min-width: 300px !important;
    width: 100% !important;
    height: 196px !important;
    ${({ theme }) => theme.mediaQueries.sm} {
      top: -2px;
      right: 0;
      width: 1126px !important;
      height: 194px !important;
    }
  }
`

export const PolygonZkEvmBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isDesktop } = useMatchBreakpoints()

  const title = isDesktop ? t('PancakeSwap Now Live on Polygon zkEVM!') : t('Polygon zkEVM is LIVE!')

  return (
    <S.Wrapper
      style={{
        background: 'linear-gradient(180deg, #9132D2 0%, #803DE1 100%)',
      }}
    >
      <S.Inner>
        <S.LeftWrapper>
          <Flex alignItems="center" mb="8px">
            <Image
              src={pancakeSwapLogo}
              alt="pancakeSwapLogo"
              width={isMobile ? 90 : 132}
              height={isMobile ? 13 : 20}
              unoptimized
            />
          </Flex>
          <Title data-text={title}>{title}</Title>
          {isDesktop && (
            <Text color="#FFE437" fontSize={24} fontWeight={700} mb="8px">
              {t('Swap, LP, and Farms on Polygon zkEVM now')}
            </Text>
          )}
          <Flex>
            <NextLinkFromReactRouter
              target="_blank"
              to="https://blog.pancakeswap.finance/articles/pancake-swap-expands-to-polygon-zk-evm-a-new-era-of-multichain-de-fi-begins"
            >
              <StyledButtonLeft scale={['xs', 'sm', 'md']}>
                <Text bold fontSize={['12px', '16px']} mr="4px">
                  {t('Get Started')}
                </Text>
                <OpenNewIcon color="white" />
              </StyledButtonLeft>
            </NextLinkFromReactRouter>
          </Flex>
        </S.LeftWrapper>
        <RightWrapper>
          <BGWrapper>
            {isMobile ? (
              <Image src={polygonZkBgMobile} alt="Background" width={338} height={176} unoptimized />
            ) : (
              <Image src={polygonZkBg} alt="Background" width={1126} height={192} unoptimized />
            )}
          </BGWrapper>
          {isMobile ? (
            <Image src={polygonZkBunny} alt="GalxeTraverseBunny" width={173} height={138} placeholder="blur" />
          ) : (
            <Image src={polygonZkBunny} alt="GalxeTraverseBunny" width={335} height={268} placeholder="blur" />
          )}
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}
