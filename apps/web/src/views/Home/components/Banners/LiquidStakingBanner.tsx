import { useTranslation } from '@pancakeswap/localization'
import { ArrowForwardIcon, Box, Button, Flex, Link, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import Image from 'next/legacy/image'
import { memo } from 'react'
import styled, { keyframes } from 'styled-components'
import * as S from './Styled'

const {
  liquidStakingBunny,
  liquidStakingBunnyBg1,
  liquidStakingBunnyBg2,
  liquidStakingBunnyBg2Mobile,
  liquidStakingBunnyBg3,
  liquidStakingBunnyBg4,
  liquidStakingBunnyMobile,
  liquidStakingTitle,
  liquidStakingTitleMobile,
} = {
  liquidStakingBunny: `${ASSET_CDN}/web/banners/liquidStakingBunny.png`,
  liquidStakingBunnyBg1: `${ASSET_CDN}/web/banners/liquidStakingBunnyBg1.png`,
  liquidStakingBunnyBg2: `${ASSET_CDN}/web/banners/liquidStakingBunnyBg2.png`,
  liquidStakingBunnyBg2Mobile: `${ASSET_CDN}/web/banners/liquidStakingBunnyBg2Mobile.png`,
  liquidStakingBunnyBg3: `${ASSET_CDN}/web/banners/liquidStakingBunnyBg3.png`,
  liquidStakingBunnyBg4: `${ASSET_CDN}/web/banners/liquidStakingBunnyBg4.png`,
  liquidStakingBunnyMobile: `${ASSET_CDN}/web/banners/liquidStakingBunnyMobile.png`,
  liquidStakingTitle: `${ASSET_CDN}/web/banners/liquidStakingTitle.png`,
  liquidStakingTitleMobile: `${ASSET_CDN}/web/banners/liquidStakingTitleMobile.png`,
}

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
    // liquidStakingBunny
    position: absolute !important;
    bottom: -10px;
    right: -3px;
    z-index: 2;
    ${({ theme }) => theme.mediaQueries.sm} {
      right: 26px;
      bottom: 2px;
    }
  }
  > span:nth-child(2) {
    // liquidStakingBunnyBg1
    position: absolute !important;
    top: -1px;
    right: 100px;
    z-index: 1;
    filter: blur(2px);
    ${({ theme }) => theme.mediaQueries.md} {
      top: -2px;
      right: 390px;
      filter: blur(0px);
    }
  }
  > span:nth-child(3) {
    // liquidStakingBunnyBg2
    position: absolute !important;
    bottom: 0px;
    right: 100px;
    z-index: 1;
    ${({ theme }) => theme.mediaQueries.sm} {
      bottom: 2px;
      right: 0px;
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
      bottom: 78px;
      right: 392px;
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
      right: 498px;
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
  background: linear-gradient(166.02deg, #ffb237 -5.1%, #ffeb37 75.24%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-left: 3px;
  &::after {
    letter-spacing: 0.01em;
    background: linear-gradient(166.02deg, #ffb237 -5.1%, #ffeb37 75.24%);
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
    margin-bottom: 10px;
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

const PerpetualBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isDesktop } = useMatchBreakpoints()

  return (
    <S.Wrapper
      style={{
        background: `linear-gradient(189.57deg, #E8FAFE -83.55%, #B6E4FF -40.3%, #CCC2FE 123.53%, #C6A3FF 176.26%)`,
      }}
    >
      <S.Inner>
        <S.LeftWrapper position="relative" style={{ zIndex: 2 }}>
          <Box height={isMobile ? '20px' : '29px'} mt={isMobile ? '-10px' : '0px'}>
            {isMobile ? (
              <Image
                src={liquidStakingTitleMobile}
                alt="liquidStakingTitleMobile"
                width={212}
                height={20}
                unoptimized
              />
            ) : (
              <Image src={liquidStakingTitle} alt="liquidStakingTitle" width={403} height={29} unoptimized />
            )}
          </Box>
          <Header>{isMobile ? t('WBETH Liquid Staking') : t('Liquid Staking Integration for WBETH:')}</Header>
          <StyledSubheading
            data-text={
              isMobile ? t('Stake ETH Receive WBETH') : t('ETH to WBETH conversion and earn ETH staking rewards!')
            }
          >
            {isMobile ? t('Stake ETH Receive WBETH') : t('ETH to WBETH conversion and earn ETH staking rewards!')}
          </StyledSubheading>
          <Flex style={{ gap: isMobile ? 4 : 16 }}>
            <Link href="/liquid-staking">
              <StyledButton scale={isMobile ? 'sm' : 'md'}>
                <Text
                  color="invertedContrast"
                  textTransform={isMobile ? 'uppercase' : 'capitalize'}
                  bold
                  fontSize={isMobile ? '12px' : '16px'}
                  mr="4px"
                >
                  {t('Get Started')}
                </Text>
                {!isMobile && <ArrowForwardIcon color="invertedContrast" />}
              </StyledButton>
            </Link>
            <Link
              href="https://blog.pancakeswap.finance/articles/liquid-staking-integration-with-binance-earn-stake-eth-and-receive-wbeth-to-earn-eth-staking-rewards"
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
            <Image src={liquidStakingBunny} alt="liquidStakingBunny" width={334} height={222} unoptimized />
          ) : (
            <Image src={liquidStakingBunnyMobile} alt="liquidStakingBunnyMobile" width={159} height={197} unoptimized />
          )}
          {isDesktop ? (
            <Image src={liquidStakingBunnyBg1} alt="liquidStakingBunnyBg1" width={140} height={57} unoptimized />
          ) : (
            <Image src={liquidStakingBunnyBg1} alt="liquidStakingBunnyBg1Mobile" width={90} height={37} unoptimized />
          )}
          {isDesktop ? (
            <Image src={liquidStakingBunnyBg2} alt="liquidStakingBunnyBg2" width={61} height={78} unoptimized />
          ) : (
            <Image
              src={liquidStakingBunnyBg2Mobile}
              alt="liquidStakingBunnyBg2Mobile"
              width={57}
              height={57}
              unoptimized
            />
          )}
          <Image src={liquidStakingBunnyBg3} alt="liquidStakingBunnyBg3" width={33} height={31} unoptimized />
          <Image src={liquidStakingBunnyBg4} alt="liquidStakingBunnyBg4" width={21} height={20} unoptimized />
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default memo(PerpetualBanner)
