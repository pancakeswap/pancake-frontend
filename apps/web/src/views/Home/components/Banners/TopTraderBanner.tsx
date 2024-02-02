import { useTranslation } from '@pancakeswap/localization'
import {
  BannerContainer,
  BannerGraphics,
  BannerMain,
  BannerTitle,
  FloatingGraphic,
  LinkExternalAction,
  PancakeSwapBadge,
  BackgroundGraphic,
  GraphicDetail,
} from '@pancakeswap/widgets-internal'

import { ASSET_CDN } from 'config/constants/endpoints'

const floatingAsset = `${ASSET_CDN}/web/banners/top-traders/floating-item.png`
const bgDesktop = `${ASSET_CDN}/web/banners/top-traders/bg-desktop.png`
const bgMobile = `${ASSET_CDN}/web/banners/top-traders/bg-mobile.png`

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

export function TopTraderBanner() {
  const { t } = useTranslation()
  return (
    <BannerContainer background="radial-gradient(112.67% 197.53% at 30.75% 3.72%, #9AEDFF 0%, #CCC2FE 76.19%, #C6A3FF 100%), linear-gradient(180deg, rgba(231, 253, 255, 0.2) 0%, rgba(242, 241, 255, 0.2) 100%)">
      <BannerMain
        badges={<PancakeSwapBadge />}
        title={
          <BannerTitle variant="purple">{t('Be Our Top 100 Traders and Earn a 3% Trading Fee Rebate!')}</BannerTitle>
        }
        actions={
          <LinkExternalAction
            href="https://pancakeswap.finance/trading-reward/top-traders?utm_source=homepage&utm_medium=herobanner&utm_id=toptradersJan"
            color="#7645D9"
          >
            {t('Join Now')}
          </LinkExternalAction>
        }
      />
      <BannerGraphics>
        <BackgroundGraphic src={bgDesktop} width={468} height={224} sm={bgSmVariant} xs={bgXsVariant} />
        <FloatingGraphic src={floatingAsset} width={85} height={74} />
      </BannerGraphics>
    </BannerContainer>
  )
}
