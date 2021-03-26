import React, { useEffect } from 'react'
import styled from 'styled-components'
import { orderBy } from 'lodash'
import SwiperCore, { Keyboard, Mousewheel } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Box } from '@pancakeswap-libs/uikit'
import { useGetCurrentEpoch, useGetIntervalBlocks, useGetRounds } from 'state/hooks'
import 'swiper/swiper.min.css'
import RoundCard from './components/RoundCard'
import Menu from './components/Menu'
import useSwiper from './hooks/useSwiper'
import useSubscribeToLatestRounds from './hooks/useSubscribeToLatestRounds'
import SoonRoundCard from './components/RoundCard/SoonRoundCard'

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
const Positions: React.FC = () => {
  const { swiper, setSwiper } = useSwiper()
  const roundData = useGetRounds()
  const currentEpoch = useGetCurrentEpoch()
  const intervalBlock = useGetIntervalBlocks()
  const rounds = Object.values(roundData).reverse()
  const currentRound = rounds.find((round) => round.epoch === currentEpoch)

  useSubscribeToLatestRounds()

  useEffect(() => {
    if (swiper) {
      console.count('useEffect')
      console.log(currentEpoch)
      swiper.update()
    }
  }, [swiper, currentEpoch])

  return (
    <Box overflowX="hidden" overflowY="auto">
      <Menu />
      <StyledSwiper>
        <Swiper
          initialSlide={rounds.length - 2}
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
            <SwiperSlide key={round.id}>
              <RoundCard round={round} />
            </SwiperSlide>
          ))}
          <SwiperSlide key={currentEpoch + 1}>
            <SoonRoundCard epoch={currentEpoch + 1} blockNumber={currentRound.startBlock + intervalBlock * 2} />
          </SwiperSlide>
          <SwiperSlide key={currentEpoch + 2}>
            <SoonRoundCard epoch={currentEpoch + 2} blockNumber={currentRound.startBlock + intervalBlock * 4} />
          </SwiperSlide>
        </Swiper>
      </StyledSwiper>
    </Box>
  )
}

export default Positions
