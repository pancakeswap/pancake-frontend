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
  FloatingGraphic,
  GraphicDetail,
  LinkExternalAction,
  PancakeSwapBadge,
} from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import styled from 'styled-components'

const floatingAsset = `${ASSET_CDN}/web/banners/v4-info/floating-item.png`
const bgDesktop = `${ASSET_CDN}/web/banners/v4-info/bg-desktop.png`
const bgMobile = `${ASSET_CDN}/web/banners/v4-info/bg-mobile.png`

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

const StyledButtonLinkAction = styled(ButtonLinkAction)`
  height: 33px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.secondary};

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 48px;
    border-radius: 16px;
  }
`

const whitepaperLink =
  'https://github.com/pancakeswap/pancake-v4-core/blob/main/docs/whitepaper-en.pdf?utm_source=homepagebanner&utm_medium=banner&utm_campaign=homepagebanner&utm_id=v4whitepaper'
const learnMoreLink =
  'https://developer.pancakeswap.finance/?utm_source=homepagebanner&utm_medium=banner&utm_campaign=homepagebanner&utm_id=Startbuilding'

export const V4InfoBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()

  const readWhitepaperAction = (
    <StyledButtonLinkAction color="white" href={whitepaperLink} padding={['8px 12px']}>
      {isMobile ? t('Whitepaper') : t('Read Whitepaper')}
    </StyledButtonLinkAction>
  )

  const learnMoreAction = (
    <LinkExternalAction fontSize={['14px']} color="black" href={learnMoreLink}>
      {isMobile ? t('Build') : t('Start Building')}
    </LinkExternalAction>
  )

  return (
    <BannerContainer background="radial-gradient(112.67% 197.53% at 30.75% 3.72%, #9AEDFF 0%, #CCC2FE 76.19%, #C6A3FF 100%), linear-gradient(180deg, rgba(231, 253, 255, 0.2) 0%, rgba(242, 241, 255, 0.2) 100%)">
      <BannerMain
        badges={<PancakeSwapBadge />}
        title={
          <BannerTitle variant="purple">
            {isMobile || isTablet
              ? t('Introducing PancakeSwap v4')
              : t('Your DEX Your Innovation Introducing PancakeSwap v4')}
          </BannerTitle>
        }
        actions={
          <BannerActionContainer>
            {readWhitepaperAction}
            {learnMoreAction}
          </BannerActionContainer>
        }
      />
      <BannerGraphics>
        <BackgroundGraphic src={bgDesktop} width={468} height={224} sm={bgSmVariant} xs={bgXsVariant} />
        <FloatingGraphic src={floatingAsset} width={99} height={99} />
      </BannerGraphics>
    </BannerContainer>
  )
}
