import { useTranslation } from '@pancakeswap/localization'
import { Flex } from '@pancakeswap/uikit'
import {
  BackgroundGraphic,
  BannerActionContainer,
  BannerContainer,
  BannerGraphics,
  BannerMain,
  BannerTitle,
  ButtonLinkAction,
  GraphicDetail,
  PancakeSwapBadge,
} from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import styled from 'styled-components'

const bgDesktop = `${ASSET_CDN}/web/banners/four-meme/bg-desktop.png`
const bgMobile = `${ASSET_CDN}/web/banners/four-meme/bg-mobile.png`
const fourLogo = `${ASSET_CDN}/web/banners/four-meme/four-logo.png`

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

const StyledButton = styled(ButtonLinkAction)`
  background-color: #50e892;
  height: 2.25rem;
  font-size: 0.875rem;

  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 1128px;
    height: 3rem;
    font-size: 1rem;
  }
`

export const FourMemeBanner = () => {
  const { t } = useTranslation()

  return (
    <BannerContainer background={`url(${ASSET_CDN}/web/banners/four-meme/bg.png)`}>
      <BannerMain
        badges={
          <Flex alignItems="center">
            <PancakeSwapBadge whiteText />
            <img src={fourLogo} alt="Four Meme" width={60} height={15} style={{ margin: '1px 0 0 6px' }} />
          </Flex>
        }
        title={<BannerTitle variant="green">{t('Rocker launching your meme career')}</BannerTitle>}
        actions={
          <BannerActionContainer>
            <StyledButton external externalIcon="openNew" color="black" href="https://four.meme/">
              {t('Learn more')}
            </StyledButton>
          </BannerActionContainer>
        }
      />
      <BannerGraphics>
        <BackgroundGraphic src={bgDesktop} width={468} height={224} sm={bgSmVariant} xs={bgXsVariant} />
      </BannerGraphics>
    </BannerContainer>
  )
}
