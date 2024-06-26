import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import {
  BackgroundGraphic,
  BannerActionContainer,
  BannerContainer,
  BannerGraphics,
  BannerMain,
  FloatingGraphic,
  GraphicDetail,
  LinkExternalAction,
  PancakeSwapBadge,
} from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import styled from 'styled-components'

const bgDesktop = `${ASSET_CDN}/web/banners/ai-prediction/bg-desktop.png`
const bgMobile = `${ASSET_CDN}/web/banners/ai-prediction/bg-mobile.png`
const coBrand = `${ASSET_CDN}/web/banners/ai-prediction/arbitrum.png`
const floatingAsset = `${ASSET_CDN}/web/banners/ai-prediction/floating.png`

const startTradeLink =
  '/prediction?token=ETH&chain=arb&utm_source=homepagebanner&utm_medium=website&utm_campaign=Arbitrum&utm_id=PredictionLaunch'
const learnMoreLink =
  'https://blog.pancakeswap.finance/articles/pancake-swap-introduces-ai-powered-prediction-market-on-arbitrum-up-to-100-fund-protection-and-launching-60-000-arb-campaign?utm_source=homepagebanner&utm_medium=website&utm_campaign=Arbitrum&utm_id=PredictionLaunch'

const bgSmVariant: GraphicDetail = {
  src: bgMobile,
  width: 272,
  height: 224,
}

const bgXsVariant: GraphicDetail = {
  src: bgMobile,
  width: 221,
  height: 182,
}

const VerticalDivider = styled.span`
  background: #000000;
  width: 1px;
  height: 1rem;
  margin: auto 8px;
`

const StyledTitle = styled(Text)`
  background: linear-gradient(180deg, #ffb237 0%, #ffeb37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  font-style: normal;
  font-weight: 800;
  font-size: 18px;
  line-height: 98%;
  letter-spacing: 0.01em;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 28px;
  }
`

const StyledBannerDesc = styled(Text)`
  color: white;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 16px;
  }
`

const Desc = () => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()

  if (isMobile) return <></>

  if (isTablet) return <StyledBannerDesc>{t('60,000 ARB in rewards and up to 100% Fund Protection')}</StyledBannerDesc>

  return <StyledBannerDesc>{t('Predict to win 60,000 ARB in rewards and up to 100% Fund Protection')}</StyledBannerDesc>
}

export const PredictionBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()

  const startTradeAction = (
    <LinkExternalAction href={startTradeLink} color="#FFE238" externalIcon="arrowForward">
      <Flex color="#FFE238" alignItems="center" style={{ whiteSpace: 'nowrap' }}>
        {t('Start Prediction')}
      </Flex>
    </LinkExternalAction>
  )

  const learnMoreAction = (
    <LinkExternalAction color="#FFE238" href={learnMoreLink} style={{ whiteSpace: 'nowrap' }}>
      {t('Learn More')}
    </LinkExternalAction>
  )

  return (
    <BannerContainer background="linear-gradient(0deg, #213147 0%, #213147 100%), #000">
      <BannerMain
        badges={
          <Flex alignItems="center">
            <PancakeSwapBadge whiteText />
            <img src={coBrand} alt="Arbitrum" width={90} height={20} style={{ margin: '1px 0 0 6px' }} />
          </Flex>
        }
        desc={isMobile ? null : <Desc />}
        title={
          <StyledTitle>
            {isMobile || isTablet
              ? t('AI-Prediction Market on Arbitrum, Win 60,000 ARB')
              : t('AI-Prediction Market is live on Arbitrum')}
          </StyledTitle>
        }
        actions={
          <BannerActionContainer>
            {startTradeAction}
            {!isMobile && <VerticalDivider style={{ background: '#FFE238', opacity: 0.4 }} />}
            {learnMoreAction}
          </BannerActionContainer>
        }
      />
      <BannerGraphics>
        <BackgroundGraphic src={bgDesktop} width={468} height={224} sm={bgSmVariant} xs={bgXsVariant} />
        <FloatingGraphic src={floatingAsset} width={90} height={90} />
      </BannerGraphics>
    </BannerContainer>
  )
}
