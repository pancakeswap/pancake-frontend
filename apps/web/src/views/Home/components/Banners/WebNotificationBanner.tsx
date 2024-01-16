import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, Link, Text, useMatchBreakpoints } from '@pancakeswap/uikit'

import { ASSET_CDN } from 'config/constants/endpoints'
import Image from 'next/legacy/image'
import { memo } from 'react'
import { keyframes, styled } from 'styled-components'
import * as S from './Styled'
import { flyingAnim, flyingVerticalAnim } from './animations'
import webNotificationBgMobile from './images/web3-notification-bg-mobile.png'
import webNotificationBg from './images/web3-notification-bg.png'
import webNotificationBubbleMobile from './images/web3-notification-bubble-mobile.png'
import webNotificationBubble from './images/web3-notification-bubble.png'
import webNotificationBunny from './images/web3-notification-bunny.png'
import webNotificationCheck from './images/web3-notification-check.png'

const { liquidStakingBunnyBg3, liquidStakingBunnyBg4 } = {
  liquidStakingBunnyBg3: `${ASSET_CDN}/web/banners/star-1.png`,
  liquidStakingBunnyBg4: `${ASSET_CDN}/web/banners/star-2.png`,
}

const pancakeSwapLogo = `${ASSET_CDN}/web/banners/ethXpancakeswap.png`

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

const RightWrapper = styled.div`
  position: absolute;
  min-height: 100%;
  width: 100%;
  right: 0;
  bottom: -2px;
  z-index: 1;
  > span:first-child {
    // webNotificationBunny
    position: absolute !important;
    bottom: 2px;
    right: 0px;
    z-index: 2;
    ${({ theme }) => theme.mediaQueries.sm} {
      right: 121px;
      bottom: 2px;
    }
  }
  > span:nth-child(2) {
    // webNotificationBubble
    position: absolute !important;
    top: -20px;
    right: 120px;
    z-index: 1;
    animation: ${flyingAnim} 5.5s ease-in-out infinite 1s;
    ${({ theme }) => theme.mediaQueries.md} {
      top: -2px;
      right: 40px;
    }
  }
  > span:nth-child(3) {
    // webNotificationBg
    position: absolute !important;
    bottom: 2px;
    right: -10px;
    left: -1px;
    top: 0;
    z-index: 1;
    ${({ theme }) => theme.mediaQueries.sm} {
      bottom: 2px;
      right: 0px;
      left: auto;
      border-bottom-right-radius: 32px;
      overflow: hidden;
    }
  }
  > span:nth-child(4) {
    // liquidStakingBunnyBg3
    position: absolute !important;
    bottom: 138px;
    right: 78px;
    z-index: 1;
    animation: ${fading} 3s ease-in-out infinite 0.5s;
    ${({ theme }) => theme.mediaQueries.md} {
      bottom: 98px;
      right: 592px;
    }
  }
  > span:nth-child(5) {
    // liquidStakingBunnyBg4
    position: absolute !important;
    bottom: 29px;
    right: 26px;
    z-index: 1;
    animation: ${fading} 3s ease-in-out infinite 1.2s;
    ${({ theme }) => theme.mediaQueries.md} {
      bottom: 118px;
      right: 98px;
    }
  }
  > span:nth-child(6) {
    position: absolute !important;
    top: -30px;
    right: 26px;
    z-index: 1;
    ${({ theme }) => theme.mediaQueries.md} {
      top: -30px;
      right: 278px;
      animation: ${flyingVerticalAnim} 3.5s ease-in-out infinite;
    }
  }
`
const Header = styled.div`
  font-family: 'Kanit';
  font-style: normal;
  font-weight: 800;
  font-size: 16px;
  line-height: 101%;
  font-feature-settings: 'liga' off;
  color: #280d5f;
  margin: 5px 0px;
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 24px;
  }
`

const StyledSubheading = styled.div`
  padding-right: 100px;
  position: relative;
  font-family: 'Kanit';
  font-style: normal;
  font-weight: 800;
  font-size: 24px;
  line-height: 98%;
  letter-spacing: 0.01em;
  font-feature-settings: 'liga' off;
  background: linear-gradient(180deg, #ffb237 0%, #ffeb37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-left: 3px;
  margin-top: 5px;
  margin-bottom: 5px;
  &::after {
    letter-spacing: 0.01em;
    background: linear-gradient(180deg, #ffb237 0%, #ffeb37 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    content: attr(data-text);
    text-shadow: 1.27551px 1.27551px 1.02041px rgba(0, 0, 0, 0.2);
    -webkit-text-stroke: 5px #7645d9;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    padding-right: 100px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 24px;
    padding-left: 0px;
    margin-top: 5px;
    &::after {
      padding-right: 0px;
    }
  }
`

const StyledButton = styled(Button)`
  margin-top: 10px;
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  padding: 2px 4px;
  border-radius: 8px;
  height: auto;
  ${({ theme }) => theme.mediaQueries.md} {
    border-radius: 16px;
    height: 48px;
    padding: 4px 8px;
  }
`

const WebNotificationBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isDesktop } = useMatchBreakpoints()

  return (
    <S.Wrapper
      style={{
        background: `radial-gradient(221.88% 172.1% at 61.25% -15.44%, #C3FBFF 0%, #2BD1DE 60.8%, #7AB3F2 100%)`,
      }}
    >
      <S.Inner>
        <S.LeftWrapper position="relative" style={{ zIndex: 2 }}>
          <Box height={isMobile ? '20px' : '29px'} mt={isMobile ? '-10px' : '0px'}>
            {isMobile ? (
              <Image src={pancakeSwapLogo} alt="pancakeSwapLogo" width={124} height={16} unoptimized />
            ) : (
              <Image src={pancakeSwapLogo} alt="liquidStakingTitle" width={136} height={20} unoptimized />
            )}
          </Box>
          <StyledSubheading data-text={t('Web3 Notifications (BETA) trial available')}>
            {t('Web3 Notifications (BETA) trial available')}
          </StyledSubheading>
          {!isMobile && <Header>{t('All Your DeFi Updates, All in One Place')}</Header>}
          <Flex style={{ gap: isMobile ? 4 : 16 }}>
            <Link
              href="https://blog.pancakeswap.finance/articles/introducing-web3-notifications-on-pancake-swap"
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
        </S.LeftWrapper>
        <RightWrapper>
          {isDesktop ? (
            <Image src={webNotificationBunny} alt="webNotificationBunny" width={183} height={231} />
          ) : (
            <Image src={webNotificationBunny} alt="webNotificationBunny" width={151} height={207} />
          )}
          {!isMobile ? (
            <Image src={webNotificationBubble} alt="webNotificationBubble" width={81} height={84} />
          ) : (
            <Image src={webNotificationBubbleMobile} alt="webNotificationBubble" width={61} height={63} unoptimized />
          )}
          {!isMobile ? (
            <Image src={webNotificationBg} alt="webNotificationBg" width={515} height={136} unoptimized />
          ) : (
            <Image src={webNotificationBgMobile} alt="webNotificationBgMobile" width={338} height={176} unoptimized />
          )}
          <Image src={liquidStakingBunnyBg3} alt="liquidStakingBunnyBg3" width={33} height={31} unoptimized />
          <Image src={liquidStakingBunnyBg4} alt="liquidStakingBunnyBg4" width={21} height={20} unoptimized />
          {isDesktop && <Image src={webNotificationCheck} alt="webNotificationCheck" width={81} height={80} />}
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default memo(WebNotificationBanner)
