import { useTranslation } from '@pancakeswap/localization'
import { FlexGap, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import Image from 'next/legacy/image'
import {
  BackgroundGraphic,
  BannerActionContainer,
  BannerContainer,
  BannerGraphics,
  BannerMain,
  BannerTitle,
  BannerDesc,
  FloatingGraphic,
  GraphicDetail,
  LinkExternalAction,
  PancakeSwapBadge,
  VerticalDivider,
} from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import styled from 'styled-components'

const bgMobile = `${ASSET_CDN}/web/banners/perpetual-season-banner/bunny-bg-mobile.png`
const bgDesktop = `${ASSET_CDN}/web/banners/perpetual-season-banner/bunny-bg.png`
const floatingAsset = `${ASSET_CDN}/web/banners/perpetual-season-banner/floating.png`
const arbLogo = `${ASSET_CDN}/web/banners/perpetual-season-banner/arbSimplifiedLogo.png`
const apxLogo = `${ASSET_CDN}/web/banners/perpetual-season-banner/ApolloXCampaignLogo.png`

const bgSmVariant: GraphicDetail = {
  src: bgMobile,
  width: 272,
  height: 224,
}

const bgXsVariant: GraphicDetail = {
  src: bgMobile,
  width: 218,
  height: 182,
}

const startTradingLink =
  'https://perp.pancakeswap.finance/en/futures/v2/BTCUSD?chain=Arbitrum&utm_source=homepagebanner&utm_medium=website&utm_campaign=PerpARBIncentives&utm_id=ARBincentives'
const learnMoreLink =
  'https://blog.pancakeswap.finance/articles/trade-on-arbitrum-pancake-swap-perpetual-v2-to-win-300-000-arb?utm_source=homepagebanner&utm_medium=website&utm_campaign=PerpARBIncentives&utm_id=ARBincentives'

const StyledFlexContainer = styled(FlexGap)`
  align-items: center;
  color: white;
  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 450px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 450px;
  }
`

export const PerpetualSeasonalBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isTablet, isMd } = useMatchBreakpoints()

  return (
    <BannerContainer background="linear-gradient(140deg, #7645d9 0%, #452a7a 100%)">
      <BannerMain
        badges={
          <StyledFlexContainer gap="8px">
            <PancakeSwapBadge whiteText />
            {!(isMobile || isMd) ? (
              <Text bold color="white">
                Perpetual v2
              </Text>
            ) : null}
            <Image src={arbLogo} alt="arbLogo" width={95} height={24} />
            {!(isMobile || isMd) ? <Image src={apxLogo} alt="apxLogo" width={105} height={25} /> : null}
          </StyledFlexContainer>
        }
        title={
          <BannerTitle
            variant={{
              color: '#FFB237',
              strokeColor: '',
              strokeSize: 0,
              fontSize: isTablet ? 24 : 26,
              lineHeight: 30,
              fontWeight: 800,
            }}
          >
            {isMobile
              ? t('Trade $5,000 on Perps v2 to Win from 300,000 ARB')
              : t('Trade on Perpetuals v2 to Win 300,000 ARB')}
          </BannerTitle>
        }
        desc={
          <BannerDesc color="#EECD39">
            {!isMobile ? t('Trade at least $5,000 on perps v2 to win guaranteed reward') : null}
          </BannerDesc>
        }
        actions={
          <BannerActionContainer>
            {isMobile ? (
              <LinkExternalAction color="white" href={learnMoreLink} externalIcon="arrowForward">
                {t('Learn More')}
              </LinkExternalAction>
            ) : (
              <>
                <LinkExternalAction color="white" href={startTradingLink} externalIcon="arrowForward">
                  {t('Start Trading')}
                </LinkExternalAction>
                <VerticalDivider />
                <LinkExternalAction color="white" href={learnMoreLink}>
                  {t('Learn More')}
                </LinkExternalAction>
              </>
            )}
          </BannerActionContainer>
        }
      />
      <BannerGraphics mb={['20px', '10px', '10px', '10px', '0']}>
        <BackgroundGraphic src={bgDesktop} width={468} height={224} sm={bgSmVariant} xs={bgXsVariant} />
        <FloatingGraphic src={floatingAsset} width={99} height={99} />
      </BannerGraphics>
    </BannerContainer>
  )
}
