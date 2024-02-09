import { Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import throttle from 'lodash/throttle'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { CNY_BANNER_BG } from 'views/Lottery/pageSectionStyles'
import { CNY_BANNER_CONFIG, CnyBannerConfig, CnyBannerImage } from './bannerConfig'

const BannerContainer = styled.div<{ isDesktop: boolean }>`
  width: ${({ isDesktop }) => (isDesktop ? '500px' : '220px')};
  position: relative;
  ${({ isDesktop }) => (isDesktop ? 'margin-left: 155px' : 'margin-left: 150px')};
`
const GenericContainer = styled.div`
  position: absolute;
  width: 100%;
`

const StyledImage = styled.img<{ isDesktop: boolean }>`
  position: absolute; /* or absolute depending on your preference */
  z-index: 1; /* Adjust this value to ensure the image appears above other content */
  top: -15px; /* Adjust top position as needed */
  left: ${({ isDesktop }) => (isDesktop ? 'calc(50% - 75px - 240px)' : 'calc(50% - 75px - 100px)')};
  ${({ theme }) => theme.mediaQueries.xxl} {
    right: 0;
  }
`

const StyledPortalImageBunny = styled.img<{ isDesktop: boolean }>`
  position: absolute; /* or absolute depending on your preference */
  z-index: 1; /* Adjust this value to ensure the image appears above other content */
  top: ${({ isDesktop }) => (isDesktop ? '110px' : '125px')};
  left: ${({ isDesktop }) => (isDesktop ? 'calc(50% - 75px - 240px)' : 'calc(50% - 75px - 100px)')};
  ${({ theme }) => theme.mediaQueries.md} {
    top: ${({ isDesktop }) => (isDesktop ? '90px' : '110px')};
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    top: ${({ isDesktop }) => (isDesktop ? '100px' : '105px')};
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    top: ${({ isDesktop }) => (isDesktop ? '110px' : '115px')};
  }
  ${({ theme }) => theme.mediaQueries.xxl} {
    right: 0;
  }
`
const StyledPortalImageHat = styled.img<{ isDesktop: boolean }>`
  position: absolute; /* or absolute depending on your preference */
  z-index: 1; /* Adjust this value to ensure the image appears above other content */
  top: 216px;
  left: calc(50% - 75px - 97px);
  ${({ theme }) => theme.mediaQueries.sm} {
    top: 202px;
  }
  ${({ theme }) => theme.mediaQueries.xxl} {
    right: 0;
  }
  display: ${({ isDesktop }) => isDesktop && 'none'};
  transform: rotate(40deg);
`

export const PortalContainer: React.FC = ({ children }: any) => {
  const portalRoot = document.getElementById('portal-root')!
  const portalElement = document.createElement('div')

  useEffect(() => {
    portalRoot.appendChild(portalElement)

    return () => {
      portalRoot.removeChild(portalElement)
    }
  }, [portalElement, portalRoot])

  return createPortal(children, portalElement)
}

const ImagePortal = ({ isDesktop }: { isDesktop: boolean }) => {
  const portalRoot = document.getElementById('portal-root')!
  const portalElement = document.createElement('div')

  useEffect(() => {
    portalRoot.appendChild(portalElement)

    return () => {
      portalRoot.removeChild(portalElement)
    }
  }, [portalElement, portalRoot])

  return createPortal(
    <>
      <StyledPortalImageBunny
        isDesktop={isDesktop}
        src="/images/lottery/cny-bunny.png"
        alt=""
        height={159}
        width={149}
      />
      <StyledPortalImageHat
        isDesktop={isDesktop}
        src="/images/lottery/cny-golden-hat.png"
        alt=""
        height={40}
        width={76}
      />
      ,
    </>,
    document.body,
  )
}

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

export const CnyBannerBunnyImage = () => {
  const { isDesktop } = useMatchBreakpoints()
  const [hideImage, setHideImage] = useState(true)
  const refPrevOffset = useRef(typeof window === 'undefined' ? 0 : window.pageYOffset)

  useEffect(() => {
    const handleScroll = () => {
      const currentOffset = window.pageYOffset
      const isTopOfPage = currentOffset === 0
      if (isTopOfPage) setHideImage(true)
      if (!isTopOfPage) setHideImage(false)
      refPrevOffset.current = currentOffset
    }
    const throttledHandleScroll = throttle(handleScroll, 200)

    window.addEventListener('scroll', throttledHandleScroll)
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [])

  return (
    <>
      {!hideImage ? (
        <StyledImage isDesktop={isDesktop} src="/images/lottery/cny-bunny.png" alt="" height={159} width={149} />
      ) : (
        <ImagePortal isDesktop={isDesktop} />
      )}
    </>
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
      <CnyBannerBunnyImage />
    </Flex>
  )
}
