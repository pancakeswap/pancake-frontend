import { useTranslation } from '@pancakeswap/localization'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import {
  BackgroundGraphic,
  BannerActionContainer,
  BannerContainer,
  BannerGraphics,
  BannerCountdown,
  BannerMain,
  BannerTitle,
  GraphicDetail,
  LinkExternalAction,
  PancakeSwapBadge,
} from '@pancakeswap/widgets-internal'

import { ASSET_CDN } from 'config/constants/endpoints'
import { useActiveIfoConfig } from 'hooks/useIfoConfig'

const bgDesktop = `${ASSET_CDN}/web/banners/ifo/lista/bg-desktop.png`
const bgMobile = `${ASSET_CDN}/web/banners/ifo/lista/bg-mobile.png`

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

const getStartedLink =
  'https://blog.pancakeswap.finance/articles/get-your-uniswap-interface-fees-refunded-on-pancake-swap-up-to-8-m?utm_source=homepagebanner&utm_medium=Ethereum&utm_campaign=Swap&utm_id=InterfacefeeRefund'

export const ListaIFOBanner = () => {
  const { t } = useTranslation()
  const { activeIfo } = useActiveIfoConfig()
  const { isMobile } = useMatchBreakpoints()

  const getStarted = (
    <LinkExternalAction color="#1F198A" href={getStartedLink} style={{ whiteSpace: 'nowrap' }}>
      {t('Get started')}
    </LinkExternalAction>
  )

  return (
    <BannerContainer
      background={`url(${ASSET_CDN}/web/banners/ifo/lista/banner-bg.png)`}
      style={{ backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}
    >
      <BannerMain
        badges={<PancakeSwapBadge />}
        desc={
          <BannerCountdown
            targetTimestamp={activeIfo?.plannedStartTime || 0}
            background="#1F198A"
            color="#FFD600"
            showSeconds={!isMobile}
          />
        }
        title={<BannerTitle variant="listaBlue">{t('LISTA IFO')}</BannerTitle>}
        actions={<BannerActionContainer>{getStarted}</BannerActionContainer>}
      />
      <BannerGraphics>
        <BackgroundGraphic src={bgDesktop} width={468} height={224} sm={bgSmVariant} xs={bgXsVariant} />
      </BannerGraphics>
    </BannerContainer>
  )
}
