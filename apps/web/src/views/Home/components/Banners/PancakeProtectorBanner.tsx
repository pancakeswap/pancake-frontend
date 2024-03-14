import { useTranslation } from '@pancakeswap/localization'
import { ArrowForwardIcon, Box, Button, Flex, Link, useMatchBreakpoints } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import Image from 'next/legacy/image'
import { memo } from 'react'
import { css, styled } from 'styled-components'
import * as S from './Styled'

const { pancakeProtectorBunny, pancakeProtectorBgMobile, pancakeProtectorBg, pancakeSwapLogo } = {
  pancakeSwapLogo: `${ASSET_CDN}/web/banners/ethXpancakeswap.png`,
  pancakeProtectorBunny: `${ASSET_CDN}/web/banners/pancakeProtectorBunny.png`,
  pancakeProtectorBg: `${ASSET_CDN}/web/banners/pancakeProtectorBg.png`,
  pancakeProtectorBgMobile: `${ASSET_CDN}/web/banners/pancakeProtectorBgMobile.png`,
}

const textStyle = css`
  font-family: 'Kanit';
  font-style: normal;
  font-weight: 800;
  line-height: 98%;
  letter-spacing: 0.01em;
  background: linear-gradient(349.27deg, #ffb237 -8.6%, #ffeb37 59.55%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3));
`

const BGWrapper = styled.div`
  position: absolute;
  z-index: 1;
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
    z-index: 1;
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

const RightWrapper = styled.div`
  position: absolute;
  min-height: 100%;
  width: 100%;
  right: 0;
  bottom: -2px;
  z-index: 1;
  > span:first-child {
    // liquidStakingBunny
    position: absolute !important;
    bottom: -7px;
    right: -3px;
    z-index: 2;
    ${({ theme }) => theme.mediaQueries.sm} {
      right: 26px;
      bottom: 2px;
    }
  }
`
const Header = styled.div`
  ${textStyle}
  font-size: 29px;
  margin-bottom: 8px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-bottom: 10px;
  }
  word-spacing: 9999px;
  ${({ theme }) => theme.mediaQueries.sm} {
    word-spacing: normal;
  }
`

const StyledSubheading = styled.div`
  ${textStyle}
  font-size: 19px;
`

const StyledButton = styled(Button)`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  padding: 2px 4px;
  border-radius: 8px;
  height: auto;
  ${({ theme }) => theme.mediaQueries.md} {
    border-radius: 16px;
    height: 48px;
    padding: 4px 8px;
    font-size: 16px;
  }
`

const LogoBox = styled(Box)`
  margin-bottom: 0px;
  margin-top: -3px;
  transform: scale(0.9);
  transform-origin: top left;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0px;
    transform: scale(1);
    margin-bottom: 10px;
  }
`
const Devider = styled.div`
  background: #ffffff;
  height: 10px;
  width: 2px;
  border-radius: 1px;
`

const PancakeProtectorBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isDesktop } = useMatchBreakpoints()

  return (
    <S.Wrapper
      style={{
        background: `transparent`,
      }}
    >
      <S.Inner>
        <S.LeftWrapper position="relative" style={{ zIndex: 2 }}>
          <LogoBox>
            <Image src={pancakeSwapLogo} alt="pancakeSwapLogo" width={119} height={18} unoptimized />
          </LogoBox>
          <Header>{t('Join Pancake Protectors')}</Header>
          <StyledSubheading>{isDesktop && t('Exclusive Perks for PancakeSwap Bunnies and Squads')}</StyledSubheading>
          <Flex alignItems="center" style={{ gap: isMobile ? 4 : 16 }}>
            <Link
              href="https://blog.pancakeswap.finance/articles/pancake-protectors-is-here-discover-the-power-of-cake-and-perks-for-pancake-squads-and-bunnies"
              style={{ textDecoration: 'none' }}
              external
            >
              <StyledButton variant="text" scale={isMobile ? 'sm' : 'md'} style={{ color: 'white', paddingLeft: 0 }}>
                {t('Details')}
              </StyledButton>
            </Link>
            <Devider />
            <Link
              href="https://pancakeswap.games/project/pancake-protectors"
              external
              style={{ textDecoration: 'none' }}
            >
              <StyledButton variant="text" style={{ color: 'white' }} scale={isMobile ? 'sm' : 'md'}>
                {t('Play Now')}
                <ArrowForwardIcon color="white" />
              </StyledButton>
            </Link>
          </Flex>
        </S.LeftWrapper>
        <RightWrapper>
          {!isMobile ? (
            <Image src={pancakeProtectorBunny} alt="pancakeProtectorBunny" width={193} height={232} unoptimized />
          ) : (
            <Image src={pancakeProtectorBunny} alt="pancakeProtectorBunnyMobile" width={132} height={160} unoptimized />
          )}
          <BGWrapper>
            {!isMobile ? (
              <Image src={pancakeProtectorBg} alt="pancakeProtectorBg" width={1126} height={192} unoptimized />
            ) : (
              <Image
                src={pancakeProtectorBgMobile}
                alt="pancakeProtectorBgMobile"
                width={293}
                height={176}
                unoptimized
              />
            )}
          </BGWrapper>
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default memo(PancakeProtectorBanner)
