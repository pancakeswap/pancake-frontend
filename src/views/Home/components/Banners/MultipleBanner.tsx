import useMediaQuery from 'hooks/useMediaQuery'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import { Autoplay, EffectFade, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useMultipleBannerConfig } from './hooks/useMultipleBannerConfig'

const StyledSwiper = styled(Swiper)`
  position: relative;
  overflow: visible;
  margin-top: 180px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 55px;
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
    bottom: 5px;
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
  const theme = useTheme()
  const isDeskTop = useMediaQuery(theme.theme.mediaQueries.sm.replace('@media screen and ', ''))
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
    >
      {bannerList.map((banner, index) => {
        const childKey = `Banner${index}`
        return (
          <SwiperSlide style={{ padding: isDeskTop ? 20 : 0 }} key={childKey}>
            {banner}
          </SwiperSlide>
        )
      })}
    </StyledSwiper>
  )
}

export default MultipleBanner
