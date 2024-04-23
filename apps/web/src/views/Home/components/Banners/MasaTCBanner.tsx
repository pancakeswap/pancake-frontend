import { useTranslation } from '@pancakeswap/localization'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import {
  BackgroundGraphic,
  BannerActionContainer,
  BannerContainer,
  BannerDesc,
  BannerGraphics,
  BannerMain,
  BannerTitle,
  CoBrandBadge,
  GraphicDetail,
  LinkExternalAction,
} from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import { styled } from 'styled-components'

const VerticalDivider = styled.span`
  background: #000000;
  width: 1px;
  height: 1rem;
  margin: auto 8px;
`

const bgMobile = `${ASSET_CDN}/web/banners/masa-trading-competition/bg-mobile.png`
const bgDesktop = `${ASSET_CDN}/web/banners/masa-trading-competition/bg-desktop.png`
const coBrandLogo = `${ASSET_CDN}/web/banners/masa-trading-competition/cobrand-logo.png`

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

const participateLink =
  'https://pancakeswap.finance/swap?outputCurrency=0x944824290CC12F31ae18Ef51216A223Ba4063092&utm_source=PCSWebsite&utm_medium=HomePageBanner&utm_campaign=SwapMASA&utm_id=MASATradingCompetition'

const learnMoreLink =
  'https://blog.pancakeswap.finance/articles/join-the-masa-trading-competition-on-pancake-swap-to-win-700-000-masa?utm_source=PCSWebsite&utm_medium=HomePageBanner&utm_campaign=MASATradingCompetition&utm_id=MASATradingCompetition'

export const MasaTCBanner = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const participateAction = (
    <LinkExternalAction href={participateLink} color="#280D5F" externalIcon="arrowForward">
      {t('Start Trading')}
    </LinkExternalAction>
  )
  const learnMoreAction = (
    <LinkExternalAction color="#280D5F" href={learnMoreLink}>
      {t('Learn more')}
    </LinkExternalAction>
  )

  return (
    <BannerContainer background="linear-gradient(64deg, rgba(214, 126, 10, 0.26) 44.37%, rgba(255, 235, 55, 0.00) 102.8%), radial-gradient(113.12% 140.14% at 26.47% 0%, #F5DF8E 0%, #FCC631 33.21%, #FF9D00 79.02%);">
      <BannerMain
        badges={
          <CoBrandBadge
            coBrand={coBrandLogo}
            coBrandLogo={coBrandLogo}
            coBrandAlt="masa"
            cHeight="15"
            cWidth="60"
            dividerBg="rgba(0,0,0,0.2)"
          />
        }
        title={
          <BannerTitle variant="purple">
            {isMobile ? t('Trade to win 700,000 $MASA') : t('Join the MASA Trading Competition')}
          </BannerTitle>
        }
        desc={isMobile ? null : <BannerDesc color="#280D5F">{t('Win 700,000 $MASA')}</BannerDesc>}
        actions={
          <BannerActionContainer>
            {participateAction}
            {!isMobile && <VerticalDivider />}
            {!isMobile && learnMoreAction}x
          </BannerActionContainer>
        }
      />
      <BannerGraphics>
        <BackgroundGraphic src={bgDesktop} width={468} height={224} sm={bgSmVariant} xs={bgXsVariant} />
      </BannerGraphics>
    </BannerContainer>
  )
}
