import { useTranslation } from '@pancakeswap/localization'
import { Box, FlexGap, useMatchBreakpoints } from '@pancakeswap/uikit'
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
} from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import styled from 'styled-components'
import { arbSimplifiedLogo, apolloXCampaignLogo } from './images'

const bgMobile = `${ASSET_CDN}/web/banners/perpetual-season-banner/bunny-bg-mobile.png`
const bgDesktop = `${ASSET_CDN}/web/banners/perpetual-season-banner/bunny-bg.png`
const floatingAsset = `${ASSET_CDN}/web/banners/perpetual-season-banner/floating.png`

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

const Divider = styled.div`
  background: #fff;
  width: 1px;
  height: 1rem;
  margin: auto 8px;
  opacity: 0.4;
`

// todo: will replace after the new URL ready
const playNowLink =
  'https://pancakeswap.games/?utm_source=nemesis%20FE%20banner&utm_medium=Banner&utm_campaign=nemesis%20FE%20banner&utm_id=nemesis%20FE%20banner'
const learnMoreLink =
  'https://blog.pancakeswap.finance/articles/introducing-nemesis-downfall-pancake-swap-s-latest-game-fi-release'

const StyledFlexContainer = styled(FlexGap)`
  align-items: center;
  color: white;
  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 430px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 430px;
  }
`

export const PerpetualSeasonalBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()

  return (
    <BannerContainer>
      <BannerMain
        badges={
          <StyledFlexContainer>
            <PancakeSwapBadge whiteText />
            {!isMobile ? <Box style={{ fontWeight: 600 }}>{t('Perpetual v2')}</Box> : null}
            <Image src={arbSimplifiedLogo} alt="arbSimplifiedLogo" width={68} height={25} />
            {!isMobile ? (
              <FlexGap gap="6px">
                <Image src={apolloXCampaignLogo} alt="apolloXCampaignLogo" width={12} height={12} />
                <Box style={{ fontWeight: 600 }}>{t('APX Finance')}</Box>
              </FlexGap>
            ) : null}
          </StyledFlexContainer>
        }
        title={
          <BannerTitle
            variant={{
              color: '#FFB237',
              strokeColor: '',
              strokeSize: 0,
              fontSize: 28,
              lineHeight: 30,
              fontWeight: 800,
            }}
          >
            {isMobile ? t('Until 2 SEP, trade Perpetuals, win 300k $ARB') : t('🏆 Trade Perpetuals, Win 300,000 $ARB!')}
          </BannerTitle>
        }
        desc={<BannerDesc color="#EECD39">{!isMobile ? t('📅 18 June 2024 to 2 September 2024') : null}</BannerDesc>}
        actions={
          <BannerActionContainer>
            <LinkExternalAction color="white" href={playNowLink} externalIcon="arrowForward">
              {t('Start Trading')}
            </LinkExternalAction>
            {!isMobile ? (
              <>
                <Divider />
                <LinkExternalAction color="white" href={learnMoreLink}>
                  {t('Leaderboard')}
                </LinkExternalAction>
              </>
            ) : null}
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
