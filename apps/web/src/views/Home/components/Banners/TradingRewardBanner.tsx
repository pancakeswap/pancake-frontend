import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Button,
  Flex,
  NextLinkFromReactRouter,
  Text,
  useMatchBreakpoints,
  OpenNewIcon,
  ArrowForwardIcon,
} from '@pancakeswap/uikit'
import Image from 'next/legacy/image'
import styled, { css } from 'styled-components'
import { TradingRewardButter, TradingRewardLoveButter, TradingRewardBunny, TradingRewardBg } from './images'
import * as S from './Styled'

const RightWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  right: 0;
  top: 0;
  overflow: visible;

  > span:nth-child(1) {
    // TradingRewardBunny
    position: absolute !important;
    right: 0px;
    bottom: 0px;
    ${({ theme }) => theme.mediaQueries.lg} {
      right: 55px;
    }
  }

  > span:nth-child(2) {
    // TradingRewardButter
    position: absolute !important;
    top: -8%;
    right: 20%;

    ${({ theme }) => theme.mediaQueries.sm} {
      top: -12%;
      right: 14%;
    }

    ${({ theme }) => theme.mediaQueries.lg} {
      top: 1%;
      right: -2%;
    }
  }

  > span:nth-child(3) {
    // TradingRewardBg
    position: absolute !important;
    right: 0px;
    bottom: 0px;
  }

  > span:nth-child(4) {
    // TradingRewardLoveButter
    position: absolute !important;
    top: -30%;
    left: 55%;
  }
`

const Title = styled.div`
  font-family: 'Kanit';
  font-style: normal;
  font-weight: 600;
  font-size: 23px;
  line-height: 110%;
  color: #ffffff;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  padding-right: 80px;
  @media screen and (max-width: 375px) {
    font-size: 21px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 26px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 40px;
    padding-right: 0px;
  }
`
const StyledBox = styled(Box)`
  font-weight: 600;
  font-size: 12px;
  line-height: 110%;
  font-feature-settings: 'liga' off;
  color: #ffffff;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 21px;
    width: 100%;
  }
`

const sharedStyle = css`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  padding: 4px 8px;
  border-radius: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    border-radius: 16px;
  }
`

const StyledButtonLeft = styled(Button)`
  ${sharedStyle}
  > div {
    color: ${({ theme }) => theme.colors.white};
  }
`

const StyledButtonRight = styled(Button)`
  ${sharedStyle}
  background-color: ${({ theme }) => theme.colors.white};
  > div {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const TradingRewardBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isTablet, isDesktop } = useMatchBreakpoints()

  return (
    <S.Wrapper
      style={{
        background:
          'linear-gradient(64.41deg, rgba(214, 126, 10, 0.26) 44.37%, rgba(255, 235, 55, 0) 102.8%), radial-gradient(55.22% 134.13% at 57.59% 0%, #F5DF8E 0%, #FCC631 33.21%, #FF9D00 79.02%)',
      }}
    >
      <S.Inner>
        <S.LeftWrapper>
          <StyledBox>{t('Trade to Earn Rewards')}</StyledBox>
          <Flex flexDirection={['column', 'row']} mb={['8px', '8px', '12px']}>
            <Title>{t('$40,000 worth of CAKE in Total!')}</Title>
          </Flex>
          <Flex style={{ gap: 8 }} flexWrap={isMobile ? 'wrap' : 'nowrap'} flexDirection={['column', 'row']}>
            <NextLinkFromReactRouter to="/trading-reward">
              <StyledButtonLeft scale={['xs', 'sm', 'md']}>
                <Text bold fontSize={['12px', '16px']} mr="4px">
                  {t('Trade Now')}
                </Text>
                {!isMobile && <ArrowForwardIcon color="white" />}
              </StyledButtonLeft>
            </NextLinkFromReactRouter>
            <NextLinkFromReactRouter target="_blank" to="/" rel='"noopener noreferrer'>
              <StyledButtonRight scale={['xs', 'sm', 'md']}>
                <Text bold fontSize={['12px', '16px']} mr="4px">
                  {t('Learn More')}
                </Text>
                {!isMobile && <OpenNewIcon color="primary" />}
              </StyledButtonRight>
            </NextLinkFromReactRouter>
          </Flex>
        </S.LeftWrapper>
        <RightWrapper>
          {isMobile || isTablet ? (
            <Image src={TradingRewardBunny} alt="TradingRewardBunny" width={145} height={167} placeholder="blur" />
          ) : (
            <Image src={TradingRewardBunny} alt="TradingRewardBunny" width={220} height={249} placeholder="blur" />
          )}
          {isMobile ? (
            <Image src={TradingRewardButter} alt="TradingRewardButter" width={40} height={34} placeholder="blur" />
          ) : (
            <Image src={TradingRewardButter} alt="TradingRewardButter" width={72} height={60} placeholder="blur" />
          )}
          {!isMobile && (
            <Image src={TradingRewardBg} alt="TradingRewardBg" width={1112} height={192} placeholder="blur" />
          )}
          {isDesktop && (
            <Image
              src={TradingRewardLoveButter}
              alt="TradingRewardLoveButter"
              width={147}
              height={147}
              placeholder="blur"
            />
          )}
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default TradingRewardBanner
