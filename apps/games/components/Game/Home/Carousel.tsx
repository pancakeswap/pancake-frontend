import { useState, useCallback } from 'react'
import uniqueId from 'lodash/uniqueId'
import { styled } from 'styled-components'
import { PostersItemDataType, PostersItemData } from '@pancakeswap/games'
import { Flex, Box, ChevronLeftIcon, ChevronRightIcon } from '@pancakeswap/uikit'

import 'swiper/css'
import 'swiper/css/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperClass } from 'swiper/types'
import { Navigation } from 'swiper/modules'

const StyledCarouselImage = styled(Box)<{
  imgUrl: string
  isVideo: boolean
  isActive: boolean
  isHorizontal: boolean
}>`
  position: relative;
  cursor: pointer;
  width: 100%;
  height: ${({ isHorizontal }) => (isHorizontal ? '104px' : '143px')};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: 0.5s;
  border-radius: 8px;
  margin-top: 10px;
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

  &:after {
    display: ${({ isActive }) => (isActive ? 'block' : 'none')};
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    border-bottom: ${({ theme }) => `10px solid ${theme.colors.primary}`};
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    transform: translateX(-50%);
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-top: 0;
    width: ${({ isHorizontal }) => (isHorizontal ? '157px' : '96px')};

    &:after {
      display: none;
    }
  }
`

const StyledSwiperContainer = styled(Box)<{ isHorizontal: boolean }>`
  position: relative;
  border-radius: 0;
  background: rgba(39, 38, 44, 0.8);
  width: calc(100% + 40px);
  padding: ${({ isHorizontal }) => (isHorizontal ? '16px 6px 8px 11px' : '16px 6px 8px 16px')};
  margin: ${({ isHorizontal }) => (isHorizontal ? '0 0 0 -20px' : '0 0px 24px -20px')};

  &:before {
    display: none;
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

  ${({ theme }) => theme.mediaQueries.lg} {
    width: calc(100% + 64px);
    margin: ${({ isHorizontal }) => (isHorizontal ? '0px 0 0 -32px' : '0 0px 24px -32px')};
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    width: 100%;
    border-radius: 16px;
    margin: ${({ isHorizontal }) => (isHorizontal ? '32px 0 0 0px' : '0 0px 24px 0px')};

    &:before {
      display: block;
    }
  }
`

const StyledSwiperNavigation = styled(Flex)`
  svg {
    cursor: pointer;
  }

  svg.swiper-button-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

interface CarouselProps {
  isHorizontal: boolean
  carouselId: number
  carouselData: PostersItemData[]
  setCarouselId: (index: number) => void
}

export const Carousel: React.FC<React.PropsWithChildren<CarouselProps>> = ({
  carouselId,
  isHorizontal,
  carouselData,
  setCarouselId,
}) => {
  const [prevClass] = useState(() => uniqueId('prev-'))
  const [nextClass] = useState(() => uniqueId('next-'))

  const handleRealIndexChange = useCallback(
    (swiperInstance: SwiperClass) => {
      setCarouselId(swiperInstance.realIndex)
    },
    [setCarouselId],
  )

  return (
    <StyledSwiperContainer isHorizontal={isHorizontal}>
      <Swiper
        spaceBetween={10}
        modules={[Navigation]}
        onRealIndexChange={handleRealIndexChange}
        navigation={{
          prevEl: `.${prevClass}`,
          nextEl: `.${nextClass}`,
        }}
        breakpoints={{
          370: {
            slidesPerView: 3,
          },
          920: {
            slidesPerView: 4,
          },
        }}
      >
        {carouselData.map((carousel, index) => (
          <SwiperSlide key={carousel.image}>
            <StyledCarouselImage
              isActive={carouselId === index}
              imgUrl={carousel.image}
              isHorizontal={isHorizontal}
              isVideo={carousel.type === PostersItemDataType.Video}
              onClick={() => setCarouselId(index)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <StyledSwiperNavigation justifyContent="space-between" mt="10px">
        <ChevronLeftIcon className={prevClass} color="white" width={24} height={24} />
        <ChevronRightIcon className={nextClass} color="white" width={24} height={24} />
      </StyledSwiperNavigation>
    </StyledSwiperContainer>
  )
}
