import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { random, times } from 'lodash'
import SwiperCore, { Keyboard, Mousewheel } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Box, Flex, HelpIcon, IconButton } from '@pancakeswap-libs/uikit'
import { PricePairLabel, TimerLabel } from './components/Label'
import PrevNextNav from './components/PrevNextNav'
import History from './icons/History'

import 'swiper/swiper.min.css'

SwiperCore.use([Keyboard, Mousewheel])

const StyledSwiper = styled.div`
  .swiper-slide {
    width: 320px;
  }
`

const Row = styled(Flex)`
  flex: 1;
`

const Positions = () => {
  const [swiperInstance, setSwiperInstance] = useState(null)
  const [price, setPrice] = useState(200)

  useEffect(() => {
    const timer = setInterval(() => {
      setPrice(random(215, 230))
    }, 2000)

    return () => clearInterval(timer)
  }, [setPrice])

  const handleNext = () => {
    swiperInstance.slideNext()
  }

  const handlePrev = () => {
    swiperInstance.slidePrev()
  }

  return (
    <Box>
      <Row alignItems="center" px="16px" py="24px">
        <PricePairLabel pricePair="BNBUSDT" price={price} />
        <Row justifyContent="center">
          <PrevNextNav onNext={handleNext} onPrev={handlePrev} />
        </Row>
        <Flex alignItems="center">
          <TimerLabel secondsLeft={random(20, 300)} interval="5m" />
          <IconButton variant="subtle" ml="8px">
            <HelpIcon width="24px" color="white" />
          </IconButton>
          <IconButton variant="subtle" ml="8px">
            <History width="24px" color="white" />
          </IconButton>
        </Flex>
      </Row>
      <StyledSwiper>
        <Swiper
          initialSlide={3}
          onSwiper={setSwiperInstance}
          spaceBetween={16}
          slidesPerView="auto"
          freeMode
          freeModeSticky
          centeredSlides
          mousewheel
          keyboard
        >
          {times(10).map((k) => (
            <SwiperSlide key={k}>
              <div style={{ height: '350px', backgroundColor: 'azure' }}>{k}</div>
            </SwiperSlide>
          ))}
        </Swiper>
      </StyledSwiper>
    </Box>
  )
}

export default Positions
