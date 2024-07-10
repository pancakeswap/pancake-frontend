import { useTranslation } from '@pancakeswap/localization'
import { Flex, Link, OpenNewIcon, Text, useMatchBreakpoints, Button, Svg, SvgProps } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import Image from 'next/legacy/image'
import { memo } from 'react'
import { styled } from 'styled-components'
import * as S from './Styled'
import { moonpayBg, moonpayBgMobile, moonpayCash, mercuryoLogo } from './images'
import { flyingAnim } from './animations'

const pancakeSwapLogo = `${ASSET_CDN}/web/banners/ethXpancakeswap.png`

const CrossSVG = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 15" fill="none" {...props}>
    <path
      opacity="0.6"
      d="M0.755859 0.884766L7.08335 7.49987M13.4108 14.115L7.08335 7.49987M7.08335 7.49987L13.4108 0.884766M7.08335 7.49987L0.755859 14.115"
      stroke="white"
      strokeWidth="1.15045"
    />
  </Svg>
)

const RightWrapper = styled.div`
  position: absolute;
  min-height: 100%;
  width: 100%;
  right: 0;
  bottom: -2px;
  z-index: 1;
  > span:first-child {
    animation: ${flyingAnim} 3.5s ease-in-out infinite;
    position: absolute !important;
    right: 28px;
    top: -8px;
    z-index: 2;
    ${({ theme }) => theme.mediaQueries.sm} {
      right: 72px;
      top: -16px;
    }
  }
`

const BgWrapper = styled.div`
  position: absolute;
  top: -2px;
  right: 0px;
  overflow: hidden;
  height: 100%;
  border-radius: 32px;
  > span:first-child {
    position: relative !important;
    right: -50px;
    top: 25px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    bottom: auto;
    height: 100%;
    right: 0px;
    top: -2px;
    > span:first-child {
      position: relative !important;
      right: 0px;
      top: -20px;
    }
  }
`
const Header = styled.div`
  padding-right: 100px;
  position: relative;
  font-family: 'Kanit';
  font-style: normal;
  font-weight: 800;
  font-size: 32px;
  line-height: 98%;
  letter-spacing: 0.01em;
  font-feature-settings: 'liga' off;
  background: linear-gradient(174deg, #ffb237 0%, #ffeb37 84.45%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-left: 3px;
  margin-top: 10px;
  margin-bottom: 20px;
  &::after {
    letter-spacing: 0.01em;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    content: attr(data-text);
    text-shadow: 1.27551px 1.27551px 1.02041px rgba(0, 0, 0, 0.2);
    -webkit-text-stroke: 7px #6532cd;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    padding-right: 100px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 32px;
    padding-left: 0px;
    margin-bottom: 20px;
    &::after {
      padding-right: 0px;
    }
  }
`

const StyledImage = styled.img``

const MoonPayBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isDesktop } = useMatchBreakpoints()

  return (
    <S.Wrapper
      style={{
        background: `radial-gradient(195.13% 169.76% at 81.48% 50.00%, #54DADE 0%, #4C69B8 12.23%, #48209F 39.90%, #250D59 100%)`,
      }}
    >
      <S.Inner>
        <S.LeftWrapper position="relative" style={{ zIndex: 2, justifyContent: isMobile ? 'flex-start' : 'center' }}>
          <Flex alignItems="center" mb="8px" style={{ gap: isMobile ? 4 : 10, overflow: 'visible' }}>
            <Image
              src={pancakeSwapLogo}
              alt="pancakeSwapLogo"
              width={isMobile ? 100 : 132}
              height={isMobile ? 15 : 22}
              unoptimized
            />
            <CrossSVG width={isMobile ? 9 : 15} />
            <StyledImage
              style={{ paddingTop: isMobile ? 2 : 4 }}
              src={mercuryoLogo.src}
              alt="mercuryoLogo"
              width={isMobile ? 65 : 114}
              height={isMobile ? 9 : 15}
            />
          </Flex>
          <Header data-text={isMobile ? t('0% Fee') : t('0%  Provider  Fee until Sep 12th!')}>
            {isMobile ? t('0% Fee') : t('0%  Provider  Fee until Sep 12th!')}
          </Header>
          <Link
            style={{ textDecoration: 'none' }}
            external
            href="https://blog.pancakeswap.finance/articles/0-provider-fee-on-crypto-purchases-via-mercuryo"
          >
            <Button scale={isMobile ? 'sm' : 'md'}>
              <Text
                textTransform={isMobile ? 'uppercase' : 'capitalize'}
                bold
                fontSize={isMobile ? '12px' : '16px'}
                color="white"
              >
                {t('Get Started')}
              </Text>
              <OpenNewIcon color="white" />
            </Button>
          </Link>
        </S.LeftWrapper>
        <RightWrapper>
          {isDesktop ? (
            <Image src={moonpayCash} alt="liquidStakingBunny" width={72} height={55} placeholder="blur" />
          ) : (
            <Image src={moonpayCash} alt="liquidStakingBunnyMobile" width={56} height={43} placeholder="blur" />
          )}
          <BgWrapper>
            {!isMobile ? (
              <Image src={moonpayBg} alt="arbBg" width={504} height={214} placeholder="blur" />
            ) : (
              <Image src={moonpayBgMobile} alt="liquidStakingBunnyMobile" width={213} height={135} placeholder="blur" />
            )}
          </BgWrapper>
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default memo(MoonPayBanner)
