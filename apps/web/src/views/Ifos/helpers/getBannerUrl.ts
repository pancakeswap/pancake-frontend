import { ASSET_CDN } from 'config/constants/endpoints'

export function getBannerUrl(ifoId: string) {
  return `${ASSET_CDN}/web/ifos/bg/${ifoId}-bg.png`
}
