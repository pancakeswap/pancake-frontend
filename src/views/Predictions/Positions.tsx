import React from 'react'
import styled from 'styled-components'
import SwiperCore, { Keyboard, Mousewheel } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Box } from '@rug-zombie-libs/uikit'
import { useGetSortedRounds } from 'state/hooks'
import 'swiper/swiper.min.css'
import { BigNumber } from 'bignumber.js'
import RoundCard from './components/RoundCard'
import Menu from './components/Menu'
import useSwiper from './hooks/useSwiper'
import useOnNextRound from './hooks/useOnNextRound'
import SoonRoundCard from './components/RoundCard/SoonRoundCard'
import IncreaseBidCard from './components/RoundCard/IncreaseBidCard'
import { BIG_ZERO } from '../../utils/bigNumber'

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
  const initialIndex = Math.floor(4)

  // useOnNextRound()

  const formattedBids = bids.map((bid, i) => ({
    amount: new BigNumber(bid.amount.toString()),
    bidder: bid.bidder,
    lastBidAmount: bid[i - 1] && bid[i - 1].amount ? new BigNumber(bid[i - 1].amount.toString()) : BIG_ZERO
  }))

  return (
    <Box overflowX='hidden' overflowY='auto' style={{ width: '100%' }}>
      <Menu userInfo={userInfo} />
      <StyledSwiper style={{ width: '100%' }}>
        <Swiper
          initialSlide={initialIndex}
          onSwiper={setSwiper}
          spaceBetween={16}
          slidesPerView='auto'
          freeMode
          freeModeSticky
          centeredSlides
          mousewheel
          keyboard
          resizeObserver
        >
          {bids[lastBidId - 3] ?
            <SwiperSlide>
              <RoundCard bid={formattedBids[lastBidId - 3]} id={lastBidId - 3} userInfo={userInfo}
                         lastBidId={lastBidId} aid={aid} />
            </SwiperSlide> : null
          }
          {bids[lastBidId - 2] ?
            <SwiperSlide>
              <RoundCard bid={formattedBids[lastBidId - 2]} id={lastBidId - 2} userInfo={userInfo} lastBidId={lastBidId}
                         aid={aid} />
            </SwiperSlide> : null
          }
          {bids[lastBidId - 1] ?
            <SwiperSlide>
              <RoundCard bid={formattedBids[lastBidId - 1]} id={lastBidId - 1} userInfo={userInfo} lastBidId={lastBidId}
                         aid={aid} />
            </SwiperSlide> : null
          }
          <SwiperSlide>
            {bids.length > 0 ?
              <IncreaseBidCard
                lastBid={formattedBids[bids.length - 1]}
                userInfo={userInfo}
                aid={aid}
                id={lastBidId}
              /> :
              null
            }

          </SwiperSlide>
          <SwiperSlide>
            <SoonRoundCard lastBidId={lastBidId} id={lastBidId + 1} />
          </SwiperSlide>
        </Swiper>
      </StyledSwiper>
    </Box>
  )
}

export default Positions
