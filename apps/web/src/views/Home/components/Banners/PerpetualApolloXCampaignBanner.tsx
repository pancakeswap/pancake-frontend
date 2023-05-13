import { useTranslation } from '@pancakeswap/localization'
import { ArrowForwardIcon, Button, Link, Text, useMatchBreakpoints, useModal, Flex, Box } from '@pancakeswap/uikit'
import USCitizenConfirmModal from 'components/Modal/USCitizenConfirmModal'
import { ASSET_CDN } from 'config/constants/endpoints'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useUserNotUsCitizenAcknowledgement } from 'hooks/useUserIsUsCitizenAcknowledgement'
import Image from 'next/legacy/image'
import { memo, useMemo } from 'react'
import styled, { useTheme } from 'styled-components'
import { getPerpetualUrl } from 'utils/getPerpetualUrl'
import * as S from './Styled'

const {
  apolloXCampaignBg,
  apolloXCampaignBunny,
  apolloXCampaignTitle,
  apolloXCampaignBgMobile,
  apolloXCampaignBunnyMobile,
} = {
  apolloXCampaignBg: `${ASSET_CDN}/web/banners/ApolloXCampaignBg.png`,
  apolloXCampaignBunny: `${ASSET_CDN}/web/banners/ApolloXCampaignBunny.png`,
  apolloXCampaignTitle: `${ASSET_CDN}/web/banners/ApolloXCampaignTitle.png`,
  apolloXCampaignBgMobile: `${ASSET_CDN}/web/banners/ApolloXCampaignBgMobile.png`,
  apolloXCampaignBunnyMobile: `${ASSET_CDN}/web/banners/ApolloXCampaignBunnyMobile.png`,
}

const RightWrapper = styled.div`
  position: absolute;
  min-height: 100%;
  width: 100%;
  right: 0;
  bottom: 0px;
  z-index: 1;
  ${({ theme }) => theme.mediaQueries.sm} {
    bottom: 8.2px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    bottom: 9px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    bottom: -2px;
  }
  > span:first-child {
    // v3BgCoinUp
    position: absolute !important;
    bottom: 0px;
    right: 16px;
    z-index: 2;
    ${({ theme }) => theme.mediaQueries.md} {
      top: -20px;
      right: 116px;
      bottom: auto;
    }
  }
  > span:nth-child(2) {
    // v3BgCoinUp
    position: absolute !important;
    top: -2px;
    right: 0px;
    z-index: 1;
  }
`
const Header = styled.div`
  color: white;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 110%;
  padding-right: 120px;
  margin-bottom: 0px;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 40px;
    color: #7645d9;
    background: #ffffff;
    font-family: 'Kanit';
    -webkit-background-clip: text;
    font-weight: 800;
    font-size: 31.0448px;
    line-height: 100%;
    -webkit-text-stroke: 6px transparent;
    text-transform: none;
    letter-spacing: 0.01em;
    font-feature-settings: 'liga' off;
    margin-bottom: 4px;
    padding: 0px 15px 0px 3px;
    margin-top: 10px;
  }
`

const StyledSubheading = styled.div`
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
  display: none;
  &::after {
    letter-spacing: 0.01em;
    background: linear-gradient(166.02deg, #ffb237 -5.1%, #ffeb37 75.24%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    content: attr(data-text);
    text-shadow: 1.27551px 1.27551px 1.02041px rgba(0, 0, 0, 0.2);
    -webkit-text-stroke: 6px rgba(101, 50, 205, 1);
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
    font-size: 23px;
    padding-left: 0px;
    margin-bottom: 16px;
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
  const {
    t,
    currentLanguage: { code },
  } = useTranslation()
  const { isDesktop, isMobile } = useMatchBreakpoints()
  const { isDark } = useTheme()
  const { chainId } = useActiveChainId()

  const perpetualUrl = useMemo(() => getPerpetualUrl({ chainId, languageCode: code, isDark }), [chainId, code, isDark])
  const [onUSCitizenModalPresent] = useModal(<USCitizenConfirmModal />, true, false, 'usCitizenConfirmModal')
  const [userNotUsCitizenAcknowledgement] = useUserNotUsCitizenAcknowledgement()

  return (
    <S.Wrapper
      style={{
        background: `linear-gradient(124.53deg, #ADEAF8 -31.29%, #81D2F5 26.23%, #9992F9 91.66%)`,
      }}
    >
      <S.Inner>
        <S.LeftWrapper position="relative" style={{ zIndex: 2 }}>
          <Box height={isMobile ? '20px' : '26px'} mt={isMobile ? '-10px' : '0px'}>
            <Image
              src={apolloXCampaignTitle}
              alt="apolloXCampaignTitle"
              width={266}
              height={26}
              unoptimized
              style={{
                transform: `scale(${isMobile ? 0.8 : 1})`,
                transformOrigin: 'top left',
              }}
            />
          </Box>
          <Header>{t('Trade now to win $5000 in rewards')}</Header>
          <StyledSubheading data-text={t('25 winners every day until May 1st!')}>
            {t('25 winners every day until May 1st!')}
          </StyledSubheading>
          <Flex style={{ gap: isMobile ? 4 : 16 }}>
            <Link
              href={perpetualUrl}
              external
              onClick={(e) => {
                if (!userNotUsCitizenAcknowledgement) {
                  e.stopPropagation()
                  e.preventDefault()
                  onUSCitizenModalPresent()
                }
              }}
            >
              <StyledButton scale={isMobile ? 'sm' : 'md'}>
                <Text
                  color="invertedContrast"
                  textTransform={isMobile ? 'uppercase' : 'capitalize'}
                  bold
                  fontSize={isMobile ? '12px' : '16px'}
                  mr="4px"
                >
                  {isMobile ? t('Trade Now') : t('Start Trading')}
                </Text>
                {!isMobile && <ArrowForwardIcon color="invertedContrast" />}
              </StyledButton>
            </Link>
            <Link
              href="https://blog.pancakeswap.finance/articles/pancake-swap-s-perpetual-trading-powered-by-apollo-x-v2-now-fully-on-chain-with-low-fees-and-more-transparency"
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
            <Image src={apolloXCampaignBunny} alt="apolloXCampaignBunny" width={212} height={246} unoptimized />
          ) : (
            <Image src={apolloXCampaignBunnyMobile} alt="PerpetualBanner" width={152} height={188} unoptimized />
          )}
          {isDesktop ? (
            <Image src={apolloXCampaignBg} alt="apolloXCampaignBg" width={422} height={192} unoptimized />
          ) : (
            <Image src={apolloXCampaignBgMobile} alt="apolloXCampaignBgMobile" width={200} height={176} unoptimized />
          )}
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default memo(PerpetualBanner)
