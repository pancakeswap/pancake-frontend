import { useMemo } from 'react'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import styled, { keyframes } from 'styled-components'
import { Autoplay, EffectFade, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useMultipleBannerConfig } from './hooks/useMultipleBannerConfig'

const appearAnimation = keyframes`
  from {
    opacity: 0 ;
  }
  to {
    opacity: 1;
  }
`

const BannerPlaceHolder = styled.div<{ walletConnected: boolean }>`
  position: relative;
  height: 179px;
  ${({ theme }) => theme.mediaQueries.sm} {
    height: 221px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    height: 232px;
  }
  &::before {
    content: '';
    border-radius: 32px;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: -webkit-linear-gradient(#7645d9 0%, #452a7a 100%);
    ${({ theme }) => theme.mediaQueries.sm} {
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 20px;
    }
  }
  margin-top: ${({ walletConnected }) => (walletConnected ? '220px' : '0px')};
  margin-bottom: ${({ walletConnected }) => (walletConnected ? '-220px' : '0px')};
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-top: ${({ walletConnected }) => (walletConnected ? '190px' : '-32px')};
    margin-bottom: 30px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: ${({ walletConnected }) => (walletConnected ? '90px' : '-32px')};
    margin-bottom: ${({ walletConnected }) => (walletConnected ? '40px' : '30px')};
  }
  ${({ theme }) => theme.mediaQueries.lg},${({ theme }) => theme.mediaQueries.md} {
    padding-top: 0;
    margin-top: ${({ walletConnected }) => (walletConnected ? '60px' : '-32px')};
    margin-bottom: ${({ walletConnected }) => (walletConnected ? '60px' : '30px')};
  }
`

const StyledSwiper = styled(Swiper)`
  position: relative;
  overflow: visible;
  opacity: 0;
  animation: ${appearAnimation} 0.3s ease-in-out 0.7s forwards;
  .swiper-pagination {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    width: 108px;
    bottom: 12px;
    ${({ theme }) => theme.mediaQueries.sm} {
      bottom: 35px;
    }
    ${({ theme }) => theme.mediaQueries.md} {
      bottom: 45px;
    }
    ${({ theme }) => theme.mediaQueries.lg} {
      bottom: 35px;
    }
  }
  .swiper-pagination-bullet {
    background-color: white;
    flex-basis: 108px;
    margin: 0 !important;
    border-radius: 0px;
    &:first-child {
      border-radius: 4px 0px 0px 4px;
    }
    &:last-child {
      border-radius: 0px 4px 4px 0px;
    }
  }
`

const MultipleBanner: React.FC = () => {
  const bannerList = useMultipleBannerConfig()
  const { account } = useWeb3React()
  const { isDesktop, isTablet } = useMatchBreakpoints()

  const swiperKey = useMemo(() => {
    return bannerList.map((banner) => banner.type.type.name).join('')
  }, [bannerList])

  const swiperOptions = useMemo(() => {
    return bannerList.length > 1
      ? {
          modules: [Autoplay, Pagination, EffectFade],
          spaceBetween: 50,
          slidesPerView: 1,
          effect: 'fade' as const,
          fadeEffect: { crossFade: true },
          speed: 500,
          autoplay: { delay: 5000 },
          loop: true,
          pagination: { clickable: true },
        }
      : {}
  }, [bannerList])

  return (
    <BannerPlaceHolder walletConnected={Boolean(account)}>
      <StyledSwiper key={swiperKey} {...swiperOptions}>
        {bannerList.map((banner, index) => {
          const childKey = `Banner${index}`
          return (
            <SwiperSlide style={{ padding: isDesktop || isTablet ? 20 : 0 }} key={childKey}>
              {banner}
            </SwiperSlide>
          )
        })}
      </StyledSwiper>
    </BannerPlaceHolder>
  )
}

export default MultipleBanner
