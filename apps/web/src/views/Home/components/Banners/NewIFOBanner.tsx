import { useTranslation } from '@pancakeswap/localization'
import { Button, Flex, Link, OpenNewIcon, Text, useMatchBreakpoints } from '@pancakeswap/uikit'

import { useCountdown } from '@pancakeswap/hooks'
import { ASSET_CDN } from 'config/constants/endpoints'
import useTheme from 'hooks/useTheme'
import Image from 'next/legacy/image'
import { memo } from 'react'
import { styled } from 'styled-components'
import * as S from './Styled'

const { partnerCakePie, cakeLogo, partnerBnbChain, board, cakePie, cakePieMobile } = {
  partnerBnbChain: `${ASSET_CDN}/web/banners/partner/bnbchain-partner.png`,
  partnerCakePie: `${ASSET_CDN}/web/banners/partner/cakepie-partner.png`,
  cakeLogo: `${ASSET_CDN}/web/banners/partner/cake-logo.png`,
  board: `${ASSET_CDN}/web/banners/ifo/cakepie-board.png`,
  cakePie: `${ASSET_CDN}/web/banners/ifo/cakepie-ifo.png`,
  cakePieMobile: `${ASSET_CDN}/web/banners/ifo/cakepie-ifo-mobile.png`,
}

const Divider = styled.div`
  height: 22px;
  width: 1px;
  background-color: #c8bdc8;
`

const RightWrapper = styled.div`
  position: absolute;
  min-height: 100%;
  width: 100%;
  right: 0;
  bottom: -2px;
  z-index: 1;
  > span:first-child {
    position: absolute !important;
    bottom: 2px;
    right: 0px;
    z-index: 2;
    ${({ theme }) => theme.mediaQueries.sm} {
      right: 88px;
      bottom: 2px;
    }
  }
  > span:nth-child(2) {
    position: absolute !important;
    bottom: -2px;
    right: 120px;
    z-index: 1;
    ${({ theme }) => theme.mediaQueries.md} {
      bottom: 1px;
      right: 370px;
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
  margin-left: 3px;
  margin-top: 5px;
  margin-bottom: 5px;
  color: #08060b;
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 40px;
    padding-left: 0px;
    margin-top: 10px;
    &::after {
      padding-right: 0px;
    }
  }
`

export const CountDownWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e8a571;
  font-family: Kanit;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 110%; /* 22px */
  color: #08060b;
  padding: 8px;
  border-radius: 8px;
  margin-top: 5px;
`

export function Countdown() {
  const { t } = useTranslation()
  const countdown = useCountdown(1704376800)
  if (!countdown) {
    return null
  }

  return (
    <CountDownWrapper>
      {t('starts in')}
      {countdown?.days}d:{countdown?.hours}h:{countdown?.minutes}m
    </CountDownWrapper>
  )
}

const NewIFOBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isDesktop } = useMatchBreakpoints()
  const { theme } = useTheme()

  return (
    <S.Wrapper
      style={{
        background: `#F0E9E2`,
      }}
    >
      <S.Inner>
        <S.LeftWrapper position="relative" style={{ zIndex: 2 }}>
          <Flex
            height={isMobile ? '20px' : '43px'}
            mt={isMobile ? '-10px' : '0px'}
            justifyContent="center"
            alignItems="center"
            style={{ gap: isMobile ? 4 : 16 }}
          >
            <Image src={partnerCakePie} alt="pancakeswap-logo" width={121} height={25} unoptimized />
            <Divider />
            <Image src={cakeLogo} alt="liquidStakingTitle" width={20} height={20} unoptimized />
            <Image src={partnerBnbChain} alt="liquidStakingTitle" width={104} height={24} unoptimized />
          </Flex>
          <StyledSubheading data-text={t('Web3 Notifications (BETA) trial available')}>
            {t('CKP cIFO')}
          </StyledSubheading>
          <Countdown />
          <Flex style={{ gap: isMobile ? 4 : 16 }}>
            <Link
              href="https://blog.pancakeswap.finance/articles/introducing-web3-notifications-on-pancake-swap"
              external
              style={{ textDecoration: 'none' }}
            >
              <Button variant="text" pl="0px" pt="0px" scale={isMobile ? 'sm' : 'md'}>
                <Text
                  textTransform={isMobile ? 'uppercase' : 'capitalize'}
                  bold
                  fontSize="16px"
                  color={theme.colors.primaryDark}
                >
                  {t('Get Started')}
                </Text>
                <OpenNewIcon color={theme.colors.primaryDark} />
              </Button>
            </Link>
          </Flex>
        </S.LeftWrapper>
        <RightWrapper>
          {isDesktop ? (
            <Image src={cakePie} alt="webNotificationBunny" width={330} height={259} unoptimized />
          ) : (
            <Image src={cakePieMobile} alt="webNotificationBunny" width={151} height={207} unoptimized />
          )}
          <Image src={board} alt="webNotificationBunny" width={148} height={150} unoptimized />
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default memo(NewIFOBanner)
