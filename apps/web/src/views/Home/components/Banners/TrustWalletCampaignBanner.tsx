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
import { trustwalletBg, trustwalletBunny } from './images'
import * as S from './Styled'

const RightWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  right: 0;
  top: 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    right: 1px;
    bottom: -18px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    right: 0px;
    bottom: -2px;
  }
  overflow: visible;
  > span:first-child {
    position: absolute !important;
    right: 0px;
    bottom: 0px;
  }
  > span:last-child {
    position: absolute !important;
    right: -24px;
    bottom: -14px;
    ${({ theme }) => theme.mediaQueries.lg} {
      right: 55px;
      bottom: -20px;
    }
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
  margin-bottom: 5px;
  margin-top: 5px;
  padding-right: 80px;

  @media screen and (max-width: 375px) {
    font-size: 21px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 26px;
    margin-top: 10px;
    padding-right: 240px;
    margin-bottom: 12px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 40px;
    padding-right: 0px;
    margin-bottom: 24px;
  }
`
const StyledBox = styled(Box)`
  font-weight: 600;
  font-size: 12px;
  line-height: 110%;
  font-feature-settings: 'liga' off;
  color: #ffffff;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  margin-top: -10px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 24px;
    margin-top: 0px;
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

const TrustWalletCampaignBanner = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  return (
    <S.Wrapper
      style={{
        background: `radial-gradient(104.12% 231.19% at -4.12% -5.83%, #0057AE 0.52%, #667CC6 67.41%, #19E5F5 100%)`,
      }}
    >
      <S.Inner>
        <S.LeftWrapper>
          <StyledBox>PancakeSwap x Trust Wallet</StyledBox>
          <Title>{t('Trade and win $10,000 Prize Pool')}</Title>
          <Flex style={{ gap: 8 }} flexWrap={isMobile ? 'wrap' : 'nowrap'}>
            <NextLinkFromReactRouter to="/swap?chain=eth">
              <StyledButtonLeft scale={isMobile ? 'sm' : 'md'}>
                <Text bold fontSize="16px" mr="4px">
                  {isMobile ? t('Trade Now') : t('Trade now using Trust Wallet')}
                </Text>
                <ArrowForwardIcon color="white" />
              </StyledButtonLeft>
            </NextLinkFromReactRouter>
            <NextLinkFromReactRouter target="_blank" to="https://rebrand.ly/tw-pcs" rel='"noopener noreferrer'>
              <StyledButtonRight scale={isMobile ? 'sm' : 'md'}>
                <Text bold fontSize="16px" mr="4px">
                  {t('Download Trust Wallet')}
                </Text>
                <OpenNewIcon color="primary" />
              </StyledButtonRight>
            </NextLinkFromReactRouter>
          </Flex>
        </S.LeftWrapper>
        <RightWrapper>
          {!isMobile && <Image src={trustwalletBg} alt="trustwalletBg" width={1112} height={192} placeholder="blur" />}

          {isMobile ? (
            <Image src={trustwalletBunny} alt="trustwalletBunny" width={127} height={173} placeholder="blur" />
          ) : (
            <Image src={trustwalletBunny} alt="trustwalletBunny" width={193} height={263} placeholder="blur" />
          )}
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default TrustWalletCampaignBanner
