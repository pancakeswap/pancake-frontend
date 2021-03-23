import React from 'react'
import styled from 'styled-components'
import SwiperCore, { Keyboard, Mousewheel } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Box } from '@pancakeswap-libs/uikit'
import { useGetCurrentEpoch, useGetRounds } from 'state/hooks'
import { sortRounds } from './helpers'
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
  const currentEpoch = useGetCurrentEpoch()
  const roundData = useGetRounds()
  const rounds = sortRounds(roundData, currentEpoch)
  const liveRoundIndex = rounds.findIndex((round) => round.epoch === currentEpoch)

  return (
    <Box overflowX="hidden" overflowY="auto">
      <Menu />
      <StyledSwiper>
        <Swiper
          initialSlide={liveRoundIndex >= 0 ? liveRoundIndex : 0}
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
          {rounds.map((round) => (
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
