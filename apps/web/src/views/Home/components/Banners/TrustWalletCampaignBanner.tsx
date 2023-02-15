import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, NextLinkFromReactRouter, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import Image from 'next/legacy/image'
import styled from 'styled-components'
import { trustwalletBg } from './images'
import * as S from './Styled'

const RightWrapper = styled.div`
  position: absolute;
  right: 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    right: 1px;
    bottom: -18px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    right: 0px;
    bottom: -2px;
  }
`
const AptosTitle = styled.div`
  font-family: 'Kanit';
  font-style: normal;
  font-weight: 600;
  font-size: 23px;
  line-height: 110%;
  color: #ffffff;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  margin-bottom: 21px;
  margin-top: 16px;

  @media screen and (max-width: 375px) {
    font-size: 21px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 35px;
    margin-top: 10px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 40px;
  }
`
const StyledBox = styled(Box)`
  font-weight: 600;
  font-size: 24px;
  line-height: 110%;
  font-feature-settings: 'liga' off;
  color: #ffffff;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`

const StyledButtonLeft = styled(Button)`
  > div {
    color: ${({ theme }) => theme.colors.white};
  }
`

const StyledButtonRight = styled(Button)`
  background-color: ${({ theme }) => theme.colors.white};
  > div {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const TrustWalletCampaignBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isDesktop } = useMatchBreakpoints()
  return (
    <S.Wrapper
      style={{
        background: `linear-gradient(180deg, #00BFA5 0%, #005A5A 100%)`,
        overflow: isMobile ? 'hidden' : 'visible',
      }}
    >
      <S.Inner>
        <S.LeftWrapper>
          <StyledBox>PancakeSwap x Trust Wallet</StyledBox>
          <AptosTitle>{t('Trade and win $10,000 Prize Pool')}</AptosTitle>
          <Flex style={{ gap: 8 }}>
            <NextLinkFromReactRouter
              target="_blank"
              to="https://docs.pancakeswap.finance/aptos-deployment"
              rel='"noopener noreferrer'
            >
              <StyledButtonLeft minHeight="48px">
                <Text bold fontSize="16px" mr="4px">
                  {t('Trade now using Trust Wallet')}
                </Text>
              </StyledButtonLeft>
            </NextLinkFromReactRouter>
            <StyledButtonRight
              minHeight="48px"
              onClick={() =>
                window?.open('https://docs.pancakeswap.finance/aptos-deployment', '_blank', 'noopener noreferrer')
              }
              variant="text"
            >
              <Text bold fontSize="16px" mr="4px">
                {t('Download Trust Wallet')}
              </Text>
            </StyledButtonRight>
          </Flex>
        </S.LeftWrapper>
        <RightWrapper>
          {isDesktop && <Image src={trustwalletBg} alt="trustwalletBg" width={1112} height={192} placeholder="blur" />}
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default TrustWalletCampaignBanner
