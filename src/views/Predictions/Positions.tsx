import React from 'react'
import styled from 'styled-components'
import SwiperCore, { Keyboard, Mousewheel } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Box } from '@rug-zombie-libs/uikit'
import { useGetSortedRounds } from 'state/hooks'
import 'swiper/swiper.min.css'
import RoundCard from './components/RoundCard'
import Menu from './components/Menu'
import useSwiper from './hooks/useSwiper'
import useOnNextRound from './hooks/useOnNextRound'

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

interface PositionsProps {
  bids: any[]
  lastBidId: number
}

const Positions: React.FC<PositionsProps> = ({ bids, lastBidId }) => {
  const { setSwiper } = useSwiper()
  const rounds = useGetSortedRounds()
  const initialIndex = Math.floor(rounds.length / 2)

  useOnNextRound()

  return (
    <Box overflowX="hidden" overflowY="auto" style={{width: "100%"}}>
      <Menu />
      <StyledSwiper style={{width: "100%"}}>
        <Swiper
          initialSlide={initialIndex}
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
          {bids.map((bid) => (
            <SwiperSlide key={bid.id}>
              <RoundCard bid={bid} lastBidId={lastBidId}/>
            </SwiperSlide>
          ))}
        </Swiper>
      </StyledSwiper>
    </Box>
  )
}

export default Positions
