import { useTranslation } from '@pancakeswap/localization'
import { Flex, Link, OpenNewIcon, Text, useMatchBreakpoints, Button, Svg } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import Image from 'next/legacy/image'
import { memo } from 'react'
import { styled } from 'styled-components'
import * as S from './Styled'
import { lineaBunny, lineaBgMobile, lineaBunnyMobile, lineaBg, lineaLogo } from './images'
import { flyingAnim } from './animations'

const pancakeSwapLogo = `${ASSET_CDN}/web/banners/ethXpancakeswap.png`

const CrossSVG = () => (
  <Svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
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
    // animation: ${flyingAnim} 3.5s ease-in-out infinite;
    position: absolute !important;
    right: -10px;
    top: 8px;
    z-index: 2;
    ${({ theme }) => theme.mediaQueries.sm} {
      right: 20px;
      top: 10px;
    }
    ${({ theme }) => theme.mediaQueries.lg} {
      right: 30px;
      top: -20px;
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
    right: 30px;
    top: 0px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    bottom: auto;
    height: 100%;
    right: 0px;
    top: -2px;
    > span:first-child {
      position: relative !important;
      right: 0px;
      top: 22px;
    }
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
  color: #37ffff;
  margin-top: 10px;
  margin-bottom: 20px;
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-top: 0px;
    margin-bottom: 10px;
  }
`
const SubTitle = styled.div`
  color: #37ffff;
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

const LineaBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isDesktop } = useMatchBreakpoints()

  return (
    <S.Wrapper
      style={{
        background: `linear-gradient(180deg, rgba(0, 160, 173, 0.20) 0%, rgba(0, 0, 0, 0.00) 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.85) 100%)`,
      }}
    >
      <S.Inner>
        <S.LeftWrapper position="relative" style={{ zIndex: 2, justifyContent: isMobile ? 'flex-start' : 'center' }}>
          <Flex alignItems="center" mb="8px" style={{ gap: isMobile ? 4 : 10 }}>
            <Image
              src={pancakeSwapLogo}
              alt="pancakeSwapLogo"
              width={isMobile ? 100 : 132}
              height={isMobile ? 15 : 22}
              unoptimized
            />
            <CrossSVG />
            <Image src={lineaLogo} alt="lineaLogo" width={isMobile ? 54 : 70} height={isMobile ? 15 : 20} />
          </Flex>
          <Header>{isMobile ? t('Linea is LIVE!') : t('PancakeSwap Now Live on Linea!')}</Header>
          {!isMobile && <SubTitle>{t('Swap and Provide Liquidity on Linea now')}</SubTitle>}
          <Link
            style={{ textDecoration: 'none' }}
            external
            href="https://blog.pancakeswap.finance/articles/pancake-swap-v3-on-linea"
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
            <Image src={lineaBunny} alt="liquidStakingBunny" width={353} height={196} placeholder="blur" />
          ) : (
            <Image src={lineaBunnyMobile} alt="liquidStakingBunnyMobile" width={169} height={191} placeholder="blur" />
          )}
          <BgWrapper>
            {isDesktop ? (
              <Image src={lineaBg} alt="arbBg" width={941} height={170} placeholder="blur" />
            ) : (
              <Image src={lineaBgMobile} alt="liquidStakingBunnyMobile" width={211} height={147} placeholder="blur" />
            )}
          </BgWrapper>
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default memo(LineaBanner)
