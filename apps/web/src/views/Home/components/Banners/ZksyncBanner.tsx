import { Button, Flex, Text, useMatchBreakpoints, OpenNewIcon } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'

import { useTranslation } from '@pancakeswap/localization'
import Image from 'next/legacy/image'
import { styled, css } from 'styled-components'

import { ASSET_CDN } from 'config/constants/endpoints'

import { zkSyncBg, zkSyncBunny, zkSyncBgMobile, eraLogo } from './images'
import * as S from './Styled'

const pancakeSwapLogo = `${ASSET_CDN}/web/banners/ethXpancakeswap.png`

const RightWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  right: 0;
  top: 0;
  overflow: visible;
  > span:nth-child(1) {
    // TradingRewardButter2
    position: absolute !important;
    right: -42px;
    bottom: -60px;

    ${({ theme }) => theme.mediaQueries.md} {
      right: -42px;
      bottom: -40px;
    }
    ${({ theme }) => theme.mediaQueries.lg} {
      right: 27px;
      bottom: 0;
    }
  }

  > span:nth-child(2) {
    // TradingRewardButter2
    position: absolute !important;
    right: 230px;
    top: -10%;
  }
`

const Title = styled.div`
  position: relative;
  font-family: 'Kanit';
  font-size: 25.526px;
  font-style: normal;
  font-weight: 800;
  line-height: 98%;
  padding-right: 80px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.white};

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 32px;
    margin-bottom: 4px;
    width: 100%;
  }
`

const sharedStyle = css`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  padding: 6px 12px;
  border-radius: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    border-radius: 16px;
    padding: 12px 24px;
  }
`

const Divider = styled.div`
  height: 15px;
  width: 1px;
  background-color: ${({ theme }) => theme.colors.white};
`

const StyledButtonLeft = styled(Button)`
  ${sharedStyle}
  > div {
    color: ${({ theme }) => theme.colors.white};
  }
`

export const ZksyncBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isDesktop } = useMatchBreakpoints()

  const title = isDesktop ? t('PancakeSwap Now Live on zkSync Era!') : t('Zksync is LIVE!')

  return (
    <S.Wrapper
      style={{
        background: `linear-gradient(180deg, #CCA382 0%, #9DC38F 49.77%, #9FCCCF 100%)`,
        overflow: !isDesktop ? 'hidden' : 'visible',
      }}
    >
      <S.Inner>
        <S.LeftWrapper>
          <Flex alignItems="center" mb="8px" style={{ gap: isMobile ? 10 : 14 }}>
            <Image
              src={pancakeSwapLogo}
              alt="pancakeSwapLogo"
              width={isMobile ? 100 : 132}
              height={isMobile ? 15 : 20}
              unoptimized
            />
            <Divider />
            <Image src={eraLogo} alt="eraLogo" width={isMobile ? 73 : 88} height={isMobile ? 14 : 16} />
          </Flex>
          <Title>{title}</Title>
          {isDesktop && (
            <Text color="white" fontSize={20} fontWeight={700} mb="8px">
              {t('Swap and Provide Liquidity on zkSync Era Now')}
            </Text>
          )}
          <Flex>
            <NextLinkFromReactRouter
              target="_blank"
              to="https://blog.pancakeswap.finance/articles/pancake-swap-v3-on-zk-sync-era"
            >
              <StyledButtonLeft scale={['xs', 'sm', 'md']} style={{ borderRadius: isMobile && '20px' }}>
                <Text bold fontSize={['12px', '16px']} mr="4px">
                  {isMobile ? t('Start Now') : t('Get Started')}
                </Text>
                <OpenNewIcon color="white" />
              </StyledButtonLeft>
            </NextLinkFromReactRouter>
          </Flex>
        </S.LeftWrapper>
        <RightWrapper>
          {!isDesktop ? (
            <Image src={zkSyncBgMobile} alt="zkSyncBgMobile" width={270} height={239} placeholder="blur" />
          ) : (
            <Image src={zkSyncBg} alt="zkSyncBg" width={624} height={177} placeholder="blur" />
          )}
          {isDesktop && <Image src={zkSyncBunny} alt="zkSyncBunny" width={201} height={203} placeholder="blur" />}
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}
