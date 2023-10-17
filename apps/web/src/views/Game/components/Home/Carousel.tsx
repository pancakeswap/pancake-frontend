import { useState } from 'react'
import { styled } from 'styled-components'
import { Flex, Box, ChevronLeftIcon, ChevronRightIcon } from '@pancakeswap/uikit'
import { CarouselType } from 'views/Game/types'

import 'swiper/css'
import 'swiper/css/autoplay'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperClass } from 'swiper/types'

const StyledCarouselImage = styled(Box)<{
  imgUrl: string
  isVideo: boolean
  isActive?: boolean
  isHorizontal?: boolean
}>`
  position: relative;
  cursor: pointer;
  height: ${({ isHorizontal }) => (isHorizontal ? '104px' : '143px')};
  width: ${({ isHorizontal }) => (isHorizontal ? '157px' : '96px')};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: 0.5s;
  border-radius: 8px;
  background-image: ${({ imgUrl }) => `url(${imgUrl})`};
  border: ${({ theme, isActive }) => `solid 3px  ${isActive ? theme.colors.primary : 'black'}`};

  &:before {
    content: '';
    position: absolute;
    display: ${({ isVideo }) => (isVideo ? 'block' : 'none')};
    top: 50%;
    left: 50%;
    width: 32px;
    height: 32px;
    z-index: 1;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url('/images/game/home/carousel/play-icon-1.png');
    transform: translate(-50%, -50%);
  }
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
  carouselData: Array<any>
  setCarouselId: (index: number) => void
}

export const Carousel: React.FC<React.PropsWithChildren<CarouselProps>> = ({
  isHorizontal,
  carouselData,
  setCarouselId,
}) => {
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
        {carouselData.map((carousel, index) => (
          <SwiperSlide key={carousel.imageUrl}>
            <StyledCarouselImage
              imgUrl={carousel.imageUrl}
              isHorizontal={isHorizontal}
              isVideo={carousel.type === CarouselType.VIDEO}
              onClick={() => setCarouselId(index)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Flex justifyContent="space-between" mt="10px">
        <ChevronLeftIcon color="white" cursor="pointer" width={24} height={24} />
        <ChevronRightIcon color="white" cursor="pointer" width={24} height={24} />
      </Flex>
    </StyledSwiperContainer>
  )
}
