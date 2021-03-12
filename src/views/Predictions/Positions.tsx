import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import SwiperCore, { Keyboard, Mousewheel } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Box, Flex, HelpIcon, IconButton } from '@pancakeswap-libs/uikit'
import { useGetCurrentEpoch, useGetRounds } from 'state/hooks'
import { sortRounds } from './helpers'
import { PricePairLabel, TimerLabel } from './components/Label'
import PrevNextNav from './components/PrevNextNav'
import RoundCard from './components/RoundCard'
import History from './icons/History'

import 'swiper/swiper.min.css'

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

const Row = styled(Flex)`
  flex: 1;
`

const SetCol = styled.div`
  flex: none;
  width: 270px;
`

const Positions = () => {
  const [swiperInstance, setSwiperInstance] = useState(null)
  const currentEpoch = useGetCurrentEpoch()
  const roundData = useGetRounds()
  const rounds = sortRounds(roundData, currentEpoch)
  const liveRoundIndex = rounds.findIndex((round) => round.epoch === currentEpoch)

  const handleNext = () => {
    swiperInstance.slideNext()
  }

  const handlePrev = () => {
    swiperInstance.slidePrev()
  }

  const slideToLive = useCallback(() => {
    if (swiperInstance) {
      swiperInstance.slideTo(liveRoundIndex)
    }
  }, [swiperInstance, liveRoundIndex])

  // When the epoch changes move to the live round
  useEffect(() => {
    slideToLive()
  }, [slideToLive])

  return (
    <Box>
      <Row alignItems="center" px="16px" py="24px">
        <SetCol>
          <PricePairLabel />
        </SetCol>
        <Row justifyContent="center">
          <PrevNextNav onSlideToLive={slideToLive} onNext={handleNext} onPrev={handlePrev} />
        </Row>
        <SetCol>
          <Flex alignItems="center">
            <TimerLabel interval="5m" />
            <IconButton variant="subtle" ml="8px">
              <HelpIcon width="24px" color="white" />
            </IconButton>
            <IconButton variant="subtle" ml="8px">
              <History width="24px" color="white" />
            </IconButton>
          </Flex>
        </SetCol>
      </Row>
      <StyledSwiper>
        <Swiper
          initialSlide={liveRoundIndex >= 0 ? liveRoundIndex : 0}
          onSwiper={setSwiperInstance}
          spaceBetween={16}
          slidesPerView="auto"
          freeMode
          freeModeSticky
          centeredSlides
          mousewheel
          keyboard
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
