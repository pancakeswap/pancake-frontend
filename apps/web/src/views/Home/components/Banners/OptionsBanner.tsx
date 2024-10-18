import { useTranslation } from '@pancakeswap/localization'
import { Text, useMatchBreakpoints, useModal } from '@pancakeswap/uikit'
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
import USCitizenConfirmModal from 'components/Modal/USCitizenConfirmModal'
import { IdType, useUserNotUsCitizenAcknowledgement } from 'hooks/useUserIsUsCitizenAcknowledgement'
import { OPTIONS_URL } from 'config/constants'
import { useCallback } from 'react'

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

const learnMoreLink =
  'https://blog.pancakeswap.finance/articles/introducing-clamm-options-trading-on-pancake-swap-in-collaboration-with-stryke-formerly-dopex'

const TryItNowAction: React.FC = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const [optionsConfirmed] = useUserNotUsCitizenAcknowledgement(IdType.OPTIONS)

  const [onOptionsConfirmModalPresent] = useModal(
    <USCitizenConfirmModal
      title={t('PancakeSwap Options')}
      id={IdType.OPTIONS}
      href={OPTIONS_URL}
      desc={
        <Text mt="0.5rem">
          {t(
            'Please note that you are being redirected to an externally hosted website associated with our partner Stryke (formerly Dopex).',
          )}
        </Text>
      }
    />,
    true,
    false,
    'optionsConfirmModal',
  )

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      const preventRedirect = () => {
        e.preventDefault()
        e.stopPropagation()
      }

      if (!optionsConfirmed) {
        preventRedirect()
        onOptionsConfirmModalPresent()
      }
    },
    [optionsConfirmed, onOptionsConfirmModalPresent],
  )

  return isMobile ? (
    <LinkExternalAction
      fontSize={['14px']}
      color="primary"
      href={OPTIONS_URL}
      onClick={onClick}
      externalIcon="arrowForward"
    >
      {t('Try it now')}
    </LinkExternalAction>
  ) : (
    <StyledButtonLinkAction color="#3A3057" href={OPTIONS_URL} onClick={onClick} externalIcon="arrowForward">
      {t('Try it now')}
    </StyledButtonLinkAction>
  )
}

export const OptionsBanner = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

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
            <TryItNowAction />
            {isMobile ? null : (
              <LinkExternalAction color="primary" href={learnMoreLink}>
                {t('Learn more')}
              </LinkExternalAction>
            )}
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
