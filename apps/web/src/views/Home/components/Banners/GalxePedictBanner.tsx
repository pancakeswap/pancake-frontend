import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Link, OpenNewIcon, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import Image from 'next/legacy/image'
import { memo } from 'react'
import { styled } from 'styled-components'
import * as S from './Styled'
import { galxePredictorsBg, galxeBirthdayCampaignPedictMobile } from './images'

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
  bottom: -10px;
  right: 0px;
  border-radius: 32px;
  ${({ theme }) => theme.mediaQueries.sm} {
    bottom: auto;
    height: 100%;
    right: 0px;
    top: 0px;
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

const GalxePredictBanner = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  return (
    <S.Wrapper
      style={{
        background: 'radial-gradient(circle, rgba(66,159,169,1) 0%, rgba(89,58,151,1) 100%)',
      }}
    >
      <S.Inner>
        <S.LeftWrapper position="relative" style={{ zIndex: 2, justifyContent: isMobile ? 'flex-start' : 'center' }}>
          <Flex alignItems="center" style={{ gap: isMobile ? 4 : 12 }} mb="8px">
            <Image
              src={pancakeSwapLogo}
              alt="pancakeSwapLogo"
              width={isMobile ? 90 : 132}
              height={isMobile ? 13 : 20}
              unoptimized
            />
          </Flex>
          <Box maxWidth="780px" marginTop="12px">
            <StyledSubheading
              data-text={isMobile ? t('Jupiter Predictors:') : t('Predict, win and share $10,000 rewards')}
            >
              {isMobile ? t('Jupiter Predictors:') : t('Predict, win and share $10,000 rewards')}
            </StyledSubheading>
          </Box>

          <Flex marginTop={isMobile ? '24px' : '12px'}>
            <Link style={{ textDecoration: 'none' }} external href="https://pancakeswap.finance/prediction">
              <Text
                textTransform={isMobile ? 'uppercase' : 'capitalize'}
                bold
                fontSize={isMobile ? '12px' : '16px'}
                mr="4px"
                color="white"
              >
                {t('Predict now')}
              </Text>
            </Link>
            <Text
              textTransform={isMobile ? 'uppercase' : 'capitalize'}
              bold
              fontSize={isMobile ? '12px' : '16px'}
              mr="4px"
              color="white"
              px="8px"
            >
              |
            </Text>
            <Link
              style={{ textDecoration: 'none' }}
              external
              href="https://blog.pancakeswap.finance/articles/pancake-swap-s-de-fi-galaxy-tour-planet-5-jupiter-predictors-predicting-crypto-movements"
            >
              <Text
                textTransform={isMobile ? 'uppercase' : 'capitalize'}
                bold
                fontSize={isMobile ? '12px' : '16px'}
                mr="4px"
                color="white"
              >
                {t('Learn more')}
              </Text>
              <OpenNewIcon color="white" />
            </Link>
          </Flex>
        </S.LeftWrapper>
        <RightWrapper>
          <BgWrapper>
            {!isMobile ? (
              <Image src={galxePredictorsBg} height={192} alt="liquidStakingBunny" placeholder="blur" />
            ) : (
              <Image src={galxeBirthdayCampaignPedictMobile} height={192} alt="liquidStakingBunny" placeholder="blur" />
            )}
          </BgWrapper>
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default memo(GalxePredictBanner)
