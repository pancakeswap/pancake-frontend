import { useTranslation } from '@pancakeswap/localization'
import {
  BannerContainer,
  BannerGraphics,
  BannerMain,
  BannerTitle,
  FloatingGraphic,
  LinkExternalAction,
  PancakeSwapBadge,
  PrimaryGraphic,
  SecondaryGraphic,
  TertiaryGraphic,
} from '@pancakeswap/widgets-internal'

import { ASSET_CDN } from 'config/constants/endpoints'

const primaryAsset = `${ASSET_CDN}/web/banners/top-traders/primary-item.png`
const secondaryAsset = `${ASSET_CDN}/web/banners/top-traders/secondary-item.png`
const tertiaryAsset = `${ASSET_CDN}/web/banners/top-traders/tertiary-item.png`
const floatingAsset = `${ASSET_CDN}/web/banners/top-traders/floating-item.png`

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
        <SecondaryGraphic src={secondaryAsset} width={78} height={129} />
        <PrimaryGraphic src={primaryAsset} width={257} height={246} />
        <TertiaryGraphic src={tertiaryAsset} width={161} height={157} />
        <FloatingGraphic src={floatingAsset} width={85} height={74} />
      </BannerGraphics>
    </BannerContainer>
  )
}
