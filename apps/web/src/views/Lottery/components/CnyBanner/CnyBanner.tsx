import { useMatchBreakpoints } from '@pancakeswap/uikit'
import Image from 'next/image'
import styled from 'styled-components'
import { CNY_BANNER_CONFIG, CnyBannerConfig, CnyBannerImage } from './bannerConfig'

const BannerContainer = styled.div<{ isDesktop: boolean }>`
  width: ${({ isDesktop }) => (isDesktop ? '500px' : '220px')};
  position: relative;
  ${({ isDesktop }) => isDesktop && 'margin-left: 125px'};
`
const GenericContainer = styled.div`
  position: absolute;
  width: 100%;
`
const CnyBannerAsset = ({
  asset,
  bannerView,
  options,
}: {
  asset: CnyBannerConfig
  bannerView: 'desktopProps' | 'mobileProps'
  options: any
}) => {
  const bannerImage = asset.imageSrc
  const baseStyles = asset[bannerView]
  const { height, width, ...styles } = baseStyles
  return (
    <GenericContainer style={{ ...styles, ...options }}>
      <Image src={bannerImage} alt={asset.alt} height={height} width={width} />
    </GenericContainer>
  )
}

export const CnyBanner = () => {
  const { isDesktop } = useMatchBreakpoints()
  const bannerView = isDesktop ? 'desktopProps' : 'mobileProps'
  return (
    <BannerContainer isDesktop={isDesktop}>
      {/* <CnyBannerAsset asset={CNY_BANNER_CONFIG.Bunny} bannerView={bannerView} options={{ zIndex: 5 }} /> */}
      <CnyBannerAsset
        asset={CNY_BANNER_CONFIG.GoldenHat}
        bannerView={bannerView}
        options={{ zIndex: 5, width: '200px', transform: `rotate(${!isDesktop ? '40deg' : '0deg'})` }}
      />
      <CnyBannerAsset asset={CNY_BANNER_CONFIG.GoldenCoin} bannerView={bannerView} options={{ zIndex: 1 }} />
      <CnyBannerAsset
        asset={CNY_BANNER_CONFIG.GoldenFruit}
        bannerView={bannerView}
        options={{ zIndex: 1, width: '150px' }}
      />
      <CnyBannerAsset asset={CNY_BANNER_CONFIG.BannerBeak} bannerView={bannerView} options={{ zIndex: 5 }} />
      <Image
        src={CnyBannerImage[bannerView].imageSrc}
        height={CnyBannerImage[bannerView].height}
        width={CnyBannerImage[bannerView].width}
        alt="cny-banner-desktop"
      />
    </BannerContainer>
  )
}
