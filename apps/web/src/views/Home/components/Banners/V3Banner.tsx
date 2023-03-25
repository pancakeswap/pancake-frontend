import { useTranslation } from '@pancakeswap/localization'
import { Button, NextLinkFromReactRouter, Text, useMatchBreakpoints, OpenNewIcon } from '@pancakeswap/uikit'
import Image from 'next/legacy/image'
import styled, { css, keyframes } from 'styled-components'
import { v3AirdropBunny, v3BgBlingBlur, v3BgBlingNormal, v3BgCoinDown, v3BgCoinUp, v3Board } from './images'
import * as S from './Styled'

const shineAnimation = keyframes`
	0% {transform:translateX(-100%);}
  5% {transform:translateX(100%);}
	100% {transform:translateX(100%);}
`

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

const coinFlyingAnim = keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(-1px, 0px);
  }
  to {
    transform: translate(1, 0px);
  }
`

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
const StyledSubheading = styled.div`
  position: relative;
  font-family: 'Kanit';
  font-style: normal;
  font-weight: 900;
  font-size: 25px;
  line-height: 98%;
  letter-spacing: 0.01em;
  font-feature-settings: 'liga' off;
  background: linear-gradient(166.02deg, #ffb237 -5.1%, #ffeb37 75.24%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  &::after {
    letter-spacing: 0.01em;
    font-feature-settings: 'liga' off;
    background: linear-gradient(166.02deg, #ffb237 -5.1%, #ffeb37 75.24%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    content: attr(data-text);
    text-shadow: 1.27551px 1.27551px 1.02041px rgba(0, 0, 0, 0.2);
    -webkit-text-stroke: 5px rgba(101, 50, 205, 1);
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
  }
`

const RightWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  right: 0;
  top: 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    right: 1px;
    bottom: -18px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    right: 0px;
    bottom: -2px;
  }
  overflow: visible;
  > span:first-child {
    // v3Board
    position: absolute !important;
    top: 42px;
    right: 243px;
    overflow: hidden;
    display: none !important;
    ${({ theme }) => theme.mediaQueries.md} {
      display: block !important;
      &::after {
        content: '';
        top: 0;
        transform: translateX(100%);
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 1;
        animation: ${shineAnimation} 15s infinite 1s;
        background: -webkit-linear-gradient(
          left,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.8) 50%,
          rgba(128, 186, 232, 0) 99%,
          rgba(125, 185, 232, 0) 100%
        );
      }
    }
  }
  > span:nth-child(2) {
    // v3BgCoinUp
    position: absolute !important;
    top: 0px;
    right: 476px;
    display: none !important;
    ${({ theme }) => theme.mediaQueries.lg} {
      display: block !important;
      animation: ${coinFlyingAnim} 3.5s ease-in-out infinite;
    }
  }
  > span:nth-child(3) {
    // v3BgCoinDown
    position: absolute !important;
    bottom: 0px;
    right: 647px;
    display: none !important;
    ${({ theme }) => theme.mediaQueries.lg} {
      display: block !important;
      animation: ${coinFlyingAnim} 3.5s ease-in-out infinite;
    }
  }
  > span:nth-child(4) {
    // v3BgBlingBlur
    position: absolute !important;
    top: 88px;
    right: 573px;
    animation: ${fading} 3s ease-in-out infinite 0.5s;
  }
  > span:nth-child(5) {
    // v3BgBlingNormal
    position: absolute !important;
    top: 124px;
    right: 411px;
    animation: ${fading} 3s ease-in-out infinite 1s;
  }
  > span:last-child {
    position: absolute !important;
    animation: ${flyingAnim} 5.5s ease-in-out infinite;
    top: auto;
    right: -22px;
    bottom: -26px;
    display: block !important;
    ${({ theme }) => theme.mediaQueries.lg} {
      top: auto;
      right: 0px;
      bottom: -50px;
    }
  }
`
const Title = styled.div`
  font-family: 'Kanit';
  font-style: normal;
  font-weight: 600;
  font-size: 23px;
  line-height: 110%;
  color: #ffffff;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  margin-bottom: 5px;
  margin-top: 0px;
  padding-right: 80px;

  @media screen and (max-width: 375px) {
    font-size: 21px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 26px;
    margin-top: 10px;
    padding-right: 240px;
    margin-bottom: 12px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 40px;
    padding-right: 0px;
    margin-bottom: 5px;
    margin-top: -10px;
  }
`

const sharedStyle = css`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  padding: 4px 8px;
  border-radius: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    border-radius: 16px;
  }
`

const StyledButtonLeft = styled(Button)`
  ${sharedStyle}
  margin-top: 10px;
`

const V3Banner = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  return (
    <S.Wrapper
      style={{
        background: `linear-gradient(114.79deg, #C040FC -17.76%, #4B3CFF 99.88%)`,
      }}
    >
      <S.Inner>
        <S.LeftWrapper>
          <Title>{t('PancakeSwap V3')}</Title>
          <StyledSubheading data-text={t('Claim $135K CAKE Airdrop & Exclusive NFT')}>
            {t('Claim $135K CAKE Airdrop & Exclusive NFT')}
          </StyledSubheading>
          <NextLinkFromReactRouter
            target="_blank"
            to="https://blog.pancakeswap.finance/articles/participate-in-pancake-swap-v3-launch-claim-135-k-cake-airdrop-and-receive-an-exclusive-nft-for-early-supporters"
            rel='"noopener noreferrer'
          >
            <StyledButtonLeft scale={isMobile ? 'sm' : 'md'}>
              <Text bold fontSize="16px" mr="4px" color="invertedContrast">
                {isMobile ? t('Learn More') : t('Learn More')}
              </Text>
              <OpenNewIcon color="invertedContrast" />
            </StyledButtonLeft>
          </NextLinkFromReactRouter>
        </S.LeftWrapper>
        <RightWrapper>
          {!isMobile && <Image src={v3Board} alt="v3Board" width={141} height={111} placeholder="blur" />}
          {!isMobile && <Image src={v3BgCoinUp} alt="v3BgCoinUp" width={149} height={47} placeholder="blur" />}
          {!isMobile && <Image src={v3BgCoinDown} alt="v3BgCoinUp" width={187} height={75} placeholder="blur" />}
          {!isMobile && <Image src={v3BgBlingBlur} alt="v3BgBlingBlur" width={53} height={55} placeholder="blur" />}
          {!isMobile && <Image src={v3BgBlingNormal} alt="v3BgBlingNormal" width={52} height={48} placeholder="blur" />}
          {isMobile ? (
            <Image src={v3AirdropBunny} alt="v3AirdropBunnyMobile" width={195} height={199} placeholder="blur" />
          ) : (
            <Image src={v3AirdropBunny} alt="v3AirdropBunny" width={290} height={295} placeholder="blur" />
          )}
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default V3Banner
