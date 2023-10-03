import { useTranslation } from '@pancakeswap/localization'
import { Flex, Link, OpenNewIcon, Text, useMatchBreakpoints, Button, Svg, SvgProps } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import Image from 'next/legacy/image'
import { memo } from 'react'
import { styled } from 'styled-components'
import * as S from './Styled'
import { baseBunny, baseBgMobile, baseTree, baseBg, baseMoon } from './images'
import { flyingAnim } from './animations'

const pancakeSwapLogo = `${ASSET_CDN}/web/banners/ethXpancakeswap.png`

const BaseLogo = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 16" fill="none" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.8379 7.91893C15.8379 12.2924 12.2862 15.8379 7.90511 15.8379C3.74856 15.8379 0.338654 12.6466 0 8.58458H10.4853V7.25327H0C0.338654 3.19126 3.74856 0 7.90511 0C12.2862 0 15.8379 3.54542 15.8379 7.91893ZM45.2475 14.4031C47.9962 14.4031 49.799 12.9217 49.799 10.6906C49.799 8.62009 48.4424 7.6384 46.3899 7.29927L44.5692 6.99583C43.1771 6.7638 42.2488 6.15692 42.2488 4.81825C42.2488 3.46173 43.2842 2.42649 45.2475 2.42649C47.1573 2.42649 48.139 3.39033 48.2461 4.7647H49.6205C49.5134 2.94411 48.1211 1.31985 45.2653 1.31985C42.4452 1.31985 40.8924 2.9084 40.8924 4.8718C40.8924 6.96013 42.3024 7.92398 44.2301 8.24526L46.0686 8.53085C47.6035 8.79858 48.4602 9.42329 48.4602 10.7441C48.4602 12.297 47.193 13.2965 45.2653 13.2965C43.2663 13.2965 42.0168 12.3327 41.9097 10.6906H40.5533C40.6604 12.8325 42.3024 14.4031 45.2475 14.4031ZM24.9836 14.1533H19.9858V1.58759H24.8051C26.9291 1.58759 28.4105 2.83701 28.4105 4.83611C28.4105 6.28187 27.5895 7.24571 26.2688 7.56699V7.62055C27.8394 7.92398 28.8032 8.99492 28.8032 10.6727C28.8032 12.8325 27.2147 14.1533 24.9836 14.1533ZM24.6266 7.10293C26.1438 7.10293 27.0719 6.28187 27.0719 4.99674V4.81825C27.0719 3.53313 26.1438 2.72992 24.6266 2.72992H21.3246V7.10293H24.6266ZM24.7872 13.0109C26.4472 13.0109 27.4646 12.1006 27.4646 10.7084V10.5299C27.4646 9.08416 26.4294 8.20957 24.7694 8.20957H21.3246V13.0109H24.7872ZM39.6135 14.1533H38.1855L37.1146 10.7441H32.1169L31.046 14.1533H29.6894L33.8126 1.58759H35.4368L39.6135 14.1533ZM34.6871 2.96196H34.5801L32.4738 9.61964H36.7755L34.6871 2.96196ZM51.8096 14.1533V1.58759H59.8774V2.74777H53.1484V7.06723H59.342V8.20957H53.1484V12.9931H59.8774V14.1533H51.8096Z"
      fill="white"
    />
  </Svg>
)

const RightWrapper = styled.div`
  position: absolute;
  min-height: 100%;
  width: 100%;
  right: 0;
  bottom: -2px;
  z-index: 2;
  > span:first-child {
    position: absolute !important;
    right: -10px;
    bottom: 0px;
    z-index: 2;
    ${({ theme }) => theme.mediaQueries.lg} {
      right: 180px;
      top: auto;
      bottom: 1px;
    }
  }
  > span:nth-child(2) {
    position: absolute !important;
    top: -20px;
    right: 90px;
    z-index: 3;
    animation: ${flyingAnim} 3.5s ease-in-out infinite;
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
    top: 1px;
    height: 100% !important;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    bottom: auto;
    height: 100%;
    right: 0px;
    top: -1px;
    border-bottom-left-radius: 0px;
    > span:first-child {
      position: relative !important;
      right: 0px;
      top: 0px;
    }
  }
  > span:nth-child(2) {
    position: absolute !important;
    bottom: -2px;
    right: 0px;
    z-index: 3;
  }
`
const Header = styled.div`
  padding-right: 100px;
  position: relative;
  font-family: 'Kanit';
  font-style: normal;
  font-weight: 800;
  font-size: 25px;
  line-height: 98%;
  letter-spacing: 0.01em;
  color: #000000;
  margin-top: 18px;
  margin-bottom: 20px;
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-top: 0px;
    margin-bottom: 10px;
  }
`
const SubTitle = styled.div`
  color: #ffffff;
  font-feature-settings: 'liga' off;
  font-family: Kanit;
  font-size: 19.847px;
  font-style: normal;
  font-weight: 700;
  line-height: 98%; /* 19.45px */
  margin-bottom: 20px;
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 10px;
  }
`

const Divider = styled.div`
  height: 15px;
  width: 1px;
  background-color: ${({ theme }) => theme.colors.white};
`

const BaseBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isDesktop } = useMatchBreakpoints()

  return (
    <S.Wrapper
      style={{
        background: `linear-gradient(180deg, #0052FF 0%, #FFF 100%)`,
        overflow: isMobile ? 'hidden' : 'visible',
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
            <Divider />
            <BaseLogo width={60} height={16} />
          </Flex>
          <Header>{isMobile ? t('Base is LIVE!') : t('PancakeSwap Now Live on Base!')}</Header>
          {!isMobile && <SubTitle>{t('Swap and Provide Liquidity Now')}</SubTitle>}
          <Link
            style={{ textDecoration: 'none' }}
            external
            href="https://blog.pancakeswap.finance/articles/pancake-swap-v3-on-base"
          >
            <Button variant="text" pl="0px" pt="0px" scale={isMobile ? 'sm' : 'md'}>
              <Text textTransform={isMobile ? 'uppercase' : 'capitalize'} bold fontSize="16px" color="#000000">
                {t('Get Started')}
              </Text>
              <OpenNewIcon color="#000000" />
            </Button>
          </Link>
        </S.LeftWrapper>
        <RightWrapper>
          {isDesktop ? (
            <>
              <Image src={baseBunny} alt="baseBunny" width={218} height={203} placeholder="blur" />
              <Image src={baseMoon} alt="baseMoon" width={123} height={94} placeholder="blur" />
            </>
          ) : (
            <Image src={baseBunny} alt="baseBunny" width={196} height={182} placeholder="blur" />
          )}
          <BgWrapper>
            {isDesktop ? (
              <>
                <Image src={baseBg} alt="baseBg" width={624} height={192} placeholder="blur" />
                <Image src={baseTree} alt="baseTree" width={149} height={150} placeholder="blur" />
              </>
            ) : (
              <Image src={baseBgMobile} alt="baseBgMobile" width={316} height={176} placeholder="blur" />
            )}
          </BgWrapper>
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default memo(BaseBanner)
