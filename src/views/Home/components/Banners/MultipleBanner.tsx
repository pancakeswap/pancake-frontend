import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Autoplay, EffectFade, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useMultipleBannerConfig } from './hooks/useMultipleBannerConfig'

const StyledSwiper = styled(Swiper)<{ walletConnected: boolean }>`
  position: relative;
  overflow: visible;
  padding-top: ${({ walletConnected }) => (walletConnected ? '220px' : '0px')};
  margin-bottom: ${({ walletConnected }) => (walletConnected ? '-220px' : '0px')};
  ${({ theme }) => theme.mediaQueries.xl} {
    padding-top: ${({ walletConnected }) => (walletConnected ? '60px' : '0px')};
    margin-top: ${({ walletConnected }) => (walletConnected ? '0px' : '-32px')};
    margin-bottom: unset;
  }

  .swiper-wrapper {
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
  }
  .swiper-pagination {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    width: 108px;
    bottom: 12px;
    ${({ theme }) => theme.mediaQueries.md} {
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
  const { isDesktop } = useMatchBreakpoints()
  return (
    <StyledSwiper
      modules={[Autoplay, Pagination, EffectFade]}
      spaceBetween={50}
      slidesPerView={1}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      speed={500}
      autoplay
      loop
      pagination={{ clickable: true }}
      walletConnected={Boolean(account)}
    >
      {bannerList.map((banner, index) => {
        const childKey = `Banner${index}`
        return (
          <SwiperSlide style={{ padding: isDesktop ? 20 : 0 }} key={childKey}>
            {banner}
          </SwiperSlide>
        )
      })}
    </StyledSwiper>
  )
}

export default MultipleBanner
