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
import SoonRoundCard from './components/RoundCard/SoonRoundCard'
import IncreaseBidCard from './components/RoundCard/IncreaseBidCard'

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
  lastBidId: number,
  userInfo: any,
  aid: number
}

const Positions: React.FC<PositionsProps> = ({ bids, lastBidId, userInfo, aid }) => {
  const { setSwiper } = useSwiper()
  const rounds = useGetSortedRounds()
  const initialIndex = Math.floor(rounds.length / 2)

  useOnNextRound()

  return (
    <Box overflowX="hidden" overflowY="auto" style={{width: "100%"}}>
      <Menu userInfo={userInfo} />
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
          {bids[lastBidId - 3] ?
            <SwiperSlide>
              <RoundCard bid={bids[lastBidId - 3]} userInfo={userInfo} lastBidId={lastBidId} aid={aid}/>
            </SwiperSlide> : null
          }
          {bids[lastBidId - 2] ?
            <SwiperSlide>
              <RoundCard bid={bids[lastBidId - 2]} userInfo={userInfo} lastBidId={lastBidId} aid={aid}/>
            </SwiperSlide> : null
          }
          {bids[lastBidId - 1] ?
            <SwiperSlide>
              <RoundCard bid={bids[lastBidId - 1]} userInfo={userInfo} lastBidId={lastBidId} aid={aid}/>
            </SwiperSlide> : null
          }
          <SwiperSlide>
            { bids.length > 0 ?
              <IncreaseBidCard
              lastBid={bids[bids.length - 1]}
              userInfo={userInfo}
              aid={aid}
            /> :
              null
            }

          </SwiperSlide>
          <SwiperSlide>
            <SoonRoundCard lastBidId={lastBidId} />
          </SwiperSlide>
        </Swiper>
      </StyledSwiper>
    </Box>
  )
}

export default Positions
