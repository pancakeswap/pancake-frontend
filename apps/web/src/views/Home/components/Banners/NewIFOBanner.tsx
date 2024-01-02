import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, Link, OpenNewIcon, Text, useMatchBreakpoints } from '@pancakeswap/uikit'

import { useCountdown } from '@pancakeswap/hooks'
import { ASSET_CDN } from 'config/constants/endpoints'
import useTheme from 'hooks/useTheme'
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

const Image = styled.img``

const Divider = styled.div`
  height: 22px;
  width: 1px;
  background-color: #c8bdc8;
`

const BackGroundLayer = styled.div`
  position: absolute;
  min-height: 100%;
  width: 100%;
  right: 0;
  bottom: 0px;
  z-index: 1;
  overflow: hidden;
  border-radius: 32px;
`

const RightWrapper = styled.div`
  position: absolute;
  min-height: 100%;
  width: 100%;
  right: 0;
  bottom: 0px;
  z-index: 1;
  overflow: hidden;
  border-radius: 32px;
  ${({ theme }) => theme.mediaQueries.sm} {
    overflow: visible;
  }
  > img:first-child {
    position: absolute !important;
    bottom: -40px;
    right: -50px;
    z-index: 2;
    width: 201px;
    ${({ theme }) => theme.mediaQueries.sm} {
      right: 10px;
      bottom: 0px;
      width: 278px;
    }
    ${({ theme }) => theme.mediaQueries.md} {
      width: 330px;
      right: 60px;
      bottom: 0px;
    }
  }
  > img:nth-child(2) {
    position: absolute !important;
    bottom: -2px;
    right: 75px;
    z-index: 3;
    width: 115px;
    ${({ theme }) => theme.mediaQueries.sm} {
      bottom: 0px;
      right: 235px;
    }
    ${({ theme }) => theme.mediaQueries.md} {
      width: 148px;
      bottom: 0px;
      right: 340px;
    }
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
  align-items: self-start;
  background-color: #e8a571;
  font-family: Kanit;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 90%;
  color: #08060b;
  padding: 6px;
  border-radius: 8px;
  margin-top: 5px;
  gap: 0px;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    gap: 8px;
    padding: 8px;
    font-size: 20px;
    line-height: 110%; /* 22px */
  }
`

const BackGroundCircle = styled.div`
  position: absolute;
  top: 41px;
  right: -117px;
  width: 296px;
  height: 296px;
  border-radius: 296px;
  opacity: 0.5;
  background: radial-gradient(50% 50% at 50% 50%, #c87c59 0%, rgba(228, 150, 91, 0) 100%);
  z-index: 1;
  filter: blur(64.5px);
`

const BackGroundCircle2 = styled.div`
  position: absolute;
  top: -148px;
  left: calc(50% - 148px);
  width: 296px;
  height: 296px;
  border-radius: 296px;
  background: radial-gradient(50% 50% at 50% 50%, #d4e3e0 0%, rgba(212, 227, 224, 0) 100%);
  filter: blur(49.5px);
`

const BackGroundCircle3 = styled.div`
  position: absolute;
  bottom: -150px;
  left: calc(50% - 238px);
  width: 296px;
  height: 296px;
  border-radius: 296px;
  background: radial-gradient(50% 50% at 50% 50%, #beb1ce 0%, rgba(190, 177, 206, 0) 100%);
  filter: blur(64.5px);
`

export function Countdown() {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const countdown = useCountdown(1704369600)
  if (!countdown) {
    return null
  }
  const hours = countdown?.hours < 10 ? `0${countdown?.hours}` : countdown?.hours
  const minutes = countdown?.minutes < 10 ? `0${countdown?.minutes}` : countdown?.minutes
  return (
    <CountDownWrapper>
      <Box style={{ fontSize: isMobile ? '12px' : '20px' }}>{t('starts in')}</Box>
      <Box>
        0{countdown?.days}d:{hours}h:{minutes}m
      </Box>
    </CountDownWrapper>
  )
}

const NewIFOBanner = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
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
            justifyContent="center"
            alignItems="center"
            style={{ gap: isMobile ? 4 : 16 }}
          >
            <Image src={partnerCakePie} alt="pancakeswap-logo" width={121} height={25} />
            <Divider />
            <Image src={cakeLogo} alt="liquidStakingTitle" width={20} height={20} />
            <Image src={partnerBnbChain} alt="liquidStakingTitle" width={104} height={24} />
          </Flex>
          <StyledSubheading>{t('CKP cIFO')}</StyledSubheading>
          <Countdown />
          <Flex style={{ gap: isMobile ? 4 : 16 }}>
            <Link href="/ifo" style={{ textDecoration: 'none' }}>
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
        <BackGroundLayer>
          <BackGroundCircle />
          <BackGroundCircle2 />
          <BackGroundCircle3 />
        </BackGroundLayer>
        <RightWrapper>
          {!isMobile ? <Image src={cakePie} alt="cake-pie" /> : <Image src={cakePieMobile} alt="cake-pie-mobile" />}
          <Image src={board} alt="ifo-board" />
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default memo(NewIFOBanner)
