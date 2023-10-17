import { useState } from 'react'
import { styled } from 'styled-components'
import { Flex, Box, ChevronLeftIcon, ChevronRightIcon } from '@pancakeswap/uikit'

import 'swiper/css'
import 'swiper/css/autoplay'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperClass } from 'swiper/types'

const StyledCarouselImage = styled(Box)<{ imgUrl: string; isActive?: boolean; isHorizontal?: boolean }>`
  height: ${({ isHorizontal }) => (isHorizontal ? '104px' : '143px')};
  width: ${({ isHorizontal }) => (isHorizontal ? '157px' : '96px')};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: 0.5s;
  border-radius: 8px;
  background-image: ${({ imgUrl }) => `url(${imgUrl})`};
  border: ${({ theme, isActive }) => `solid 3px  ${isActive ? theme.colors.primary : 'black'}`};
`

const StyledSwiperContainer = styled(Box)<{ isHorizontal?: boolean }>`
  position: relative;
  border-radius: 16px;
  background: rgba(39, 38, 44, 0.8);
  padding: ${({ isHorizontal }) => (isHorizontal ? '16px 6px 8px 11px' : '16px 6px 8px 16px')};
  margin: ${({ isHorizontal }) => (isHorizontal ? '32px 0 0 0' : '0 0 24px 0')};

  &:before {
    content: '';
    position: absolute;
    top: ${({ isHorizontal }) => `${isHorizontal ? '-10px' : '20px'}`};
    left: ${({ isHorizontal }) => `${isHorizontal ? '20px' : '-10px'}`};
    width: 0;
    height: 0;

    border-top: ${({ isHorizontal }) => `${isHorizontal ? 0 : '10px solid transparent'}`};
    border-bottom: ${({ theme, isHorizontal }) =>
      `10px solid ${isHorizontal ? theme.colors.backgroundAlt : 'transparent'}`};
    border-right: ${({ theme, isHorizontal }) =>
      `10px solid ${isHorizontal ? 'transparent' : theme.colors.backgroundAlt}`};
    border-left: ${({ isHorizontal }) => `${isHorizontal ? '10px solid transparent' : 0}`};
  }
`

interface CarouselProps {
  isHorizontal: boolean
}

export const Carousel: React.FC<React.PropsWithChildren<CarouselProps>> = ({ isHorizontal }) => {
  const [swiper, setSwiper] = useState<SwiperClass | undefined>(undefined)

  return (
    <StyledSwiperContainer isHorizontal={isHorizontal}>
      <Swiper
        // loop
        resizeObserver
        slidesPerView={4}
        spaceBetween={10}
        // centeredSlides
        onSwiper={setSwiper}
      >
        <SwiperSlide>
          <StyledCarouselImage
            isHorizontal={isHorizontal}
            imgUrl="https://sgp1.digitaloceanspaces.com/strapi.space/57b10f498f5c9c518308b32a33f11539.jpg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <StyledCarouselImage
            isHorizontal={isHorizontal}
            imgUrl="https://sgp1.digitaloceanspaces.com/strapi.space/57b10f498f5c9c518308b32a33f11539.jpg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <StyledCarouselImage
            isHorizontal={isHorizontal}
            imgUrl="https://sgp1.digitaloceanspaces.com/strapi.space/57b10f498f5c9c518308b32a33f11539.jpg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <StyledCarouselImage
            isHorizontal={isHorizontal}
            imgUrl="https://sgp1.digitaloceanspaces.com/strapi.space/57b10f498f5c9c518308b32a33f11539.jpg"
          />
        </SwiperSlide>
      </Swiper>
      <Flex justifyContent="space-between" mt="10px">
        <ChevronLeftIcon color="white" cursor="pointer" width={24} height={24} />
        <ChevronRightIcon color="white" cursor="pointer" width={24} height={24} />
      </Flex>
    </StyledSwiperContainer>
  )
}
