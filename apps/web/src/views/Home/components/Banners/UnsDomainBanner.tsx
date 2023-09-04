import { useTranslation } from '@pancakeswap/localization'
import { ArrowForwardIcon, Box, Button, Flex, Link, useMatchBreakpoints } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import Image from 'next/legacy/image'
import { memo } from 'react'
import { styled, css, keyframes } from 'styled-components'
import * as S from './Styled'

const fading = keyframes`
  from {
    opacity: 0.9;
  }
  50% {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const { usnBunny, unsTitleMobile, usnTitle, unsLogo, usnBg } = {
  unsLogo: `${ASSET_CDN}/web/banners/usnLogo.png`,
  usnBunny: `${ASSET_CDN}/web/banners/usnBunny.png`,
  usnTitle: `${ASSET_CDN}/web/banners/usnTitle.png`,
  unsTitleMobile: `${ASSET_CDN}/web/banners/unsTitleMobile.png`,
  usnBg: `${ASSET_CDN}/web/banners/liquidStakingBunnyBg3.png`,
}

const textStyle = css`
  font-family: 'Kanit';
  font-style: normal;
  font-weight: 800;
  line-height: 98%;
  letter-spacing: 0.01em;
  background: linear-gradient(56.1deg, #ffa937 -21.08%, #ffeb37 89.71%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  filter: drop-shadow(1px 2px 3px rgba(0, 0, 0, 0.2));
`

const RightWrapper = styled.div`
  position: absolute;
  min-height: 100%;

  width: 100%;
  right: 0;
  bottom: -2px;
  z-index: 1;

  > span:first-child {
    // unsBunny
    position: absolute !important;
    bottom: -2px;
    right: -40px;
    z-index: 2;
    ${({ theme }) => theme.mediaQueries.sm} {
      right: 48px;
      bottom: -20px;
    }
  }
  > span:nth-child(2) {
    // unsLogo
    position: absolute !important;
    z-index: 2;
    ${({ theme }) => theme.mediaQueries.sm} {
      right: 204px;
      top: 81px;
    }
  }
  > span:nth-child(3) {
    // unsBg
    position: absolute !important;
    z-index: 2;

    ${({ theme }) => theme.mediaQueries.sm} {
      right: 338px;
      top: 28px;
      animation: ${fading} 3s ease-in-out infinite 0.5s;
    }
  }
  > span:nth-child(4) {
    // unsBg
    position: absolute !important;
    z-index: 2;
    ${({ theme }) => theme.mediaQueries.sm} {
      right: 65px;
      bottom: 28px;
      transform: rotate(-22deg);
      animation: ${fading} 3s ease-in-out infinite 3s;
    }
  }
`

const StyledSubheading = styled.div`
  ${textStyle}
  font-size: 19px;
  margin-bottom: 10px;
`

const MobileSubheading = styled.div`
  font-family: 'Kanit';
  font-style: normal;
  font-weight: 800;
  font-size: 20px;
  line-height: 98%;
  letter-spacing: 0.01em;
  color: #ffffff;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  padding-right: 150px;
  margin-top: 5px;
  margin-bottom: 10px;
`

const StyledButton = styled(Button)`
  box-shadow: none;
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
  margin-top: -10px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0px;
    transform: scale(1);
    margin-bottom: 20px;
  }
`
const Devider = styled.div`
  background: #ffffff;
  height: 10px;
  width: 2px;
  border-radius: 1px;
`
const Circle = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  right: 273px;
  top: 55px;
  border-radius: 50%;
  background: #0d67fe;
`

const UnsDomainBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isDesktop } = useMatchBreakpoints()

  return (
    <S.Wrapper
      style={{
        background: `linear-gradient(216.04deg, #454DDF 11.27%, #335FD7 84.57%, #509EE1 138.09%)`,
        overflow: isMobile ? 'hidden' : 'visible',
      }}
    >
      <S.Inner>
        <S.LeftWrapper position="relative" style={{ zIndex: 2 }}>
          <LogoBox>
            {isDesktop ? (
              <Image src={usnTitle} alt="pancakeSwapLogo" width={525} height={30} unoptimized />
            ) : (
              <Image src={unsTitleMobile} alt="pancakeSwapLogo" width={174} height={24} unoptimized />
            )}
          </LogoBox>
          {isDesktop ? (
            <StyledSubheading>
              {t('Get your custom branded subdomains .pancake.crypto for just $9.99')}
            </StyledSubheading>
          ) : (
            <MobileSubheading>{t('Subdomains .pancake.crypto for just $9.99')}</MobileSubheading>
          )}

          <Flex alignItems="center" style={{ gap: isMobile ? 4 : 16 }}>
            <Link href="https://unstoppableweb.co/43dYX40" style={{ textDecoration: 'none' }} external>
              <StyledButton variant="text" scale={isMobile ? 'sm' : 'md'} style={{ color: 'white', paddingLeft: 0 }}>
                {t('Get your domain')}
              </StyledButton>
            </Link>
            <Devider />
            <Link
              href="https://blog.pancakeswap.finance/articles/unlocking-the-power-of-web3-domains-pancake-swap-integrates-with-unstoppable-domains"
              external
              style={{ textDecoration: 'none' }}
            >
              <StyledButton variant="text" style={{ color: 'white' }} scale={isMobile ? 'sm' : 'md'}>
                {isMobile ? t('More') : t('Learn More')}
                {isMobile && <ArrowForwardIcon color="white" />}
              </StyledButton>
            </Link>
          </Flex>
        </S.LeftWrapper>
        <RightWrapper>
          {!isMobile ? (
            <Image src={usnBunny} alt="usnBunny" width={206} height={234} unoptimized />
          ) : (
            <Image src={usnBunny} alt="usnBunnyMobile" width={161} height={183} unoptimized />
          )}
          {!isMobile && (
            <>
              <Image src={unsLogo} alt="pancakeProtectorBunny" width={162} height={51} unoptimized />
              <Image src={usnBg} alt="usnBg" width={25} height={22} unoptimized />
              <Image src={usnBg} alt="usnBg" width={30} height={28} unoptimized />
              <Circle />
            </>
          )}
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default memo(UnsDomainBanner)
