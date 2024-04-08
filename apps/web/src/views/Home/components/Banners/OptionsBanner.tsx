import { useTranslation } from '@pancakeswap/localization'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import {
  BackgroundGraphic,
  BannerActionContainer,
  BannerContainer,
  BannerGraphics,
  BannerMain,
  BannerTitle,
  ButtonLinkAction,
  CoBrandBadge,
  FloatingGraphic,
  GraphicDetail,
  LinkExternalAction,
} from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import styled from 'styled-components'

const floatingAsset = `${ASSET_CDN}/web/banners/options/floating-item.png`
const bgDesktop = `${ASSET_CDN}/web/banners/options/bg-desktop.png`
const bgMobile = `${ASSET_CDN}/web/banners/options/bg-mobile.png`
const coBrand = `${ASSET_CDN}/web/banners/options/cobrand.png`
const coBrandLogo = `${ASSET_CDN}/web/banners/options/cobrand-logo.png`

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

const Floating = styled(FloatingGraphic)`
  left: 3%;
  top: 2%;
`

const StyledButtonLinkAction = styled(ButtonLinkAction)`
  height: 33px;
  border-radius: 12px;
  padding: 0 12px;
  white-space: nowrap;
`

const tryItNowLink = 'https://pancakeswap.stryke.xyz'
const learnMoreLink =
  'https://blog.pancakeswap.finance/articles/introducing-clamm-options-trading-on-pancake-swap-in-collaboration-with-stryke-formerly-dopex'

export const OptionsBanner = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const TryItNowAction = isMobile ? (
    <LinkExternalAction fontSize={['14px']} color="primary" href={tryItNowLink} externalIcon="arrowForward">
      {t('Try it now')}
    </LinkExternalAction>
  ) : (
    <StyledButtonLinkAction color="#3A3057" href={tryItNowLink} externalIcon="arrowForward">
      {t('Try it now')}
    </StyledButtonLinkAction>
  )

  const learnMoreAction = (
    <LinkExternalAction color="primary" href={learnMoreLink}>
      {t('Learn more')}
    </LinkExternalAction>
  )

  return (
    <BannerContainer background="linear-gradient(180deg, #313C5C 0%, #3C2C55 100%)">
      <BannerMain
        badges={
          <CoBrandBadge
            whiteText
            compact={isMobile}
            coBrand={coBrand}
            coBrandLogo={coBrandLogo}
            coBrandAlt="Stryke"
            cHeight="20"
            cWidth="73"
          />
        }
        title={
          <BannerTitle variant="orange">
            {isMobile
              ? t('Trade Options & Build On-Chain Liquidity')
              : t('Trade Options & Build On-Chain Options Liquidity')}
          </BannerTitle>
        }
        actions={
          <BannerActionContainer>
            {TryItNowAction}
            {isMobile ? null : learnMoreAction}
          </BannerActionContainer>
        }
      />
      <BannerGraphics>
        <BackgroundGraphic src={bgDesktop} width={468} height={224} sm={bgSmVariant} xs={bgXsVariant} />
        <Floating src={floatingAsset} width={99} height={99} />
      </BannerGraphics>
    </BannerContainer>
  )
}
