import React from 'react'
import styled from 'styled-components'
import SwiperCore, { Keyboard, Mousewheel } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Box } from '@pancakeswap/uikit'
import { useGetCurrentEpoch, useGetSortedRounds } from 'state/hooks'
import 'swiper/swiper.min.css'
import RoundCard from './components/RoundCard'
import Menu from './components/Menu'
import useSwiper from './hooks/useSwiper'
import useOnNextRound from './hooks/useOnNextRound'
import useOnViewChange from './hooks/useOnViewChange'

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
const Positions: React.FC<{ view?: string }> = ({ view }) => {
  const { setSwiper } = useSwiper()
  const rounds = useGetSortedRounds()
  const liveEpoch = useGetCurrentEpoch() - 1 || 0
  const liveRound = rounds.find((round) => round.epoch === liveEpoch)
  const liveSwiperIndex = rounds.indexOf(liveRound)

  useOnNextRound()
  useOnViewChange(liveSwiperIndex, view)

  return (
    <Box overflow="hidden">
      <Menu />
      <StyledSwiper>
        <Swiper
          initialSlide={liveSwiperIndex}
          onSwiper={setSwiper}
          spaceBetween={16}
          slidesPerView="auto"
          freeMode
          freeModeSticky
          centeredSlides
          freeModeMomentumRatio={0.25}
          freeModeMomentumVelocityRatio={0.5}
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
