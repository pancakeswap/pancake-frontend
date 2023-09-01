import { useTranslation } from '@pancakeswap/localization'
import { Flex, Link, OpenNewIcon, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import Image from 'next/legacy/image'
import { memo } from 'react'
import { styled } from 'styled-components'
import * as S from './Styled'
import { arbBg, arbBgMobile, arbBunny, arbLogo } from './images'

const pancakeSwapLogo = `${ASSET_CDN}/web/banners/ethXpancakeswap.png`

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
    bottom: 10px;
    right: 12px;
    z-index: 2;
    ${({ theme }) => theme.mediaQueries.sm} {
      right: 229px;
      bottom: 13px;
    }
  }
`

const BgWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0px;
  overflow: hidden;
  border-radius: 32px;
  ${({ theme }) => theme.mediaQueries.sm} {
    bottom: auto;
    height: 100%;
    right: 0px;
    top: -2px;
  }
`
const Header = styled.div`
  font-family: 'Kanit';
  font-style: normal;
  font-weight: 800;
  font-size: 25px;
  line-height: 101%;
  font-feature-settings: 'liga' off;
  background: linear-gradient(0deg, rgb(53, 61, 137) 100%, rgb(42, 50, 75) 0%);
  text-shadow: 1.27551px 1.27551px 1.02041px rgba(0, 0, 0, 0.2);
  -webkit-background-clip: text;
  -webkit-text-stroke: 4px transparent;
  color: white;
  padding-right: 100px;
  margin: 5px 0px;
  margin-bottom: 16px;
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 25px;
    margin-left: -4px;
    padding-left: 4px;
    padding-bottom: 4px;
  }
`

const Divider = styled.div`
  height: 15px;
  width: 1px;
  background-color: ${({ theme }) => theme.colors.white};
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
  background: linear-gradient(0deg, rgb(53, 61, 137) 100%, rgb(42, 50, 75) 0%);
  -webkit-background-clip: text;
  -webkit-text-stroke: 4px transparent;
  text-shadow: 1.27551px 1.27551px 1.02041px rgba(0, 0, 0, 0.2);
  color: white;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 20px;
    margin-left: -4px;
    padding-left: 4px;
    padding-bottom: 4px;
    margin-bottom: 10px;
    &::after {
      padding-right: 0px;
    }
  }
`

const ArbitrumOneBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isDesktop } = useMatchBreakpoints()

  return (
    <S.Wrapper
      style={{
        background: `linear-gradient(0deg, #213147 0%, #213147 100%), #000`,
      }}
    >
      <S.Inner>
        <S.LeftWrapper position="relative" style={{ zIndex: 2, justifyContent: isMobile ? 'flex-start' : 'center' }}>
          <Flex alignItems="center" mb="8px" style={{ gap: isMobile ? 10 : 14 }}>
            <Image
              src={pancakeSwapLogo}
              alt="pancakeSwapLogo"
              width={isMobile ? 100 : 132}
              height={isMobile ? 15 : 20}
              unoptimized
            />
            <Divider />
            <Image src={arbLogo} alt="arbLogo" width={isMobile ? 81 : 113} height={isMobile ? 20 : 28} />
          </Flex>
          <Header>{isMobile ? t('Arbitrum One is LIVE!') : t('PancakeSwap Now Live on Arbitrum One')}</Header>
          {isDesktop && <StyledSubheading>{t('Swap and Provide Liquidity Now')}</StyledSubheading>}

          <Link
            style={{ textDecoration: 'none' }}
            external
            href="https://blog.pancakeswap.finance/articles/pancake-swap-v3-on-arbitrum-one"
          >
            <Text
              textTransform={isMobile ? 'uppercase' : 'capitalize'}
              bold
              fontSize={isMobile ? '12px' : '16px'}
              mr="4px"
              color="white"
            >
              {t('Get Started')}
            </Text>
            <OpenNewIcon color="white" />
          </Link>
        </S.LeftWrapper>
        <RightWrapper>
          {isDesktop ? (
            <Image src={arbBunny} alt="liquidStakingBunny" width={151} height={200} placeholder="blur" />
          ) : (
            <Image src={arbBunny} alt="liquidStakingBunnyMobile" width={134} height={177} placeholder="blur" />
          )}
          <BgWrapper>
            {!isMobile ? (
              <Image src={arbBg} alt="arbBg" width={505} height={192} placeholder="blur" />
            ) : (
              <Image src={arbBgMobile} alt="liquidStakingBunnyMobile" width={240} height={176} placeholder="blur" />
            )}
          </BgWrapper>
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default memo(ArbitrumOneBanner)
