import { Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import Image from 'next/image'
import styled from 'styled-components'
import { CNY_BANNER_BG } from 'views/Lottery/pageSectionStyles'
import { CNY_BANNER_CONFIG, CnyBannerConfig, CnyBannerImage } from './bannerConfig'

const BannerContainer = styled.div<{ isDesktop: boolean }>`
  width: ${({ isDesktop }) => (isDesktop ? '500px' : '220px')};
  position: relative;
  ${({ isDesktop }) => (isDesktop ? 'margin-left: 0px' : 'margin-left: 150px')};
`
const GenericContainer = styled.div`
  position: absolute;
  width: 100%;
`

const StyledImage = styled.img<{ isDesktop: boolean }>`
  position: absolute; /* or absolute depending on your preference */
  z-index: 1; /* Adjust this value to ensure the image appears above other content */
  top: -10px; /* Adjust top position as needed */
  left: ${({ isDesktop }) => (isDesktop ? 'calc(50% - 75px - 315px)' : 'calc(50% - 75px - 100px)')};
  ${({ theme }) => theme.mediaQueries.xxl} {
    right: 0;
  }
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
    <Flex width="100%" height="125px" background={CNY_BANNER_BG} alignItems="center" justifyContent="center">
      <BannerContainer isDesktop={isDesktop}>
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
      <StyledImage isDesktop={isDesktop} src="/images/lottery/cny-bunny.png" alt="" height={159} width={149} />
    </Flex>
  )
}
