import React from 'react'
import styled from 'styled-components'
import { orderBy } from 'lodash'
import SwiperCore, { Keyboard, Mousewheel } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Box } from '@pancakeswap-libs/uikit'
import { useGetRounds } from 'state/hooks'
import RoundCard from './components/RoundCard'
import Menu from './components/Menu'

import 'swiper/swiper.min.css'
import useSwiper from './hooks/useSwiper'

SwiperCore.use([Keyboard, Mousewheel])

const StyledSwiper = styled.div`
  .swiper-wrapper {
    align-items: center;
    display: flex;
  }

  .swiper-slide {
    width: 320px;
  }
`
const Positions = () => {
  const { setSwiper } = useSwiper()
  const rounds = useGetRounds()
  const sortedRounds = orderBy(rounds, ['epoch'], ['asc'])

  return (
    <Box overflowX="hidden" overflowY="auto">
      <Menu />
      <StyledSwiper>
        <Swiper
          initialSlide={sortedRounds.length - 2}
          onSwiper={setSwiper}
          spaceBetween={16}
          slidesPerView="auto"
          freeMode
          freeModeSticky
          centeredSlides
          mousewheel
          keyboard
          resizeObserver
        >
          {sortedRounds.map((round) => (
            <SwiperSlide key={round.epoch}>
              <RoundCard round={round} />
            </SwiperSlide>
          ))}
        </Swiper>
      </StyledSwiper>
    </Box>
  )
}

export default Positions
