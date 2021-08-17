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
import { auctionById } from '../../redux/get'

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
  id: number,
  setRefresh: any,
  refresh: boolean
}

const Positions: React.FC<PositionsProps> = ({ setRefresh, refresh, id }) => {
  const { setSwiper } = useSwiper()
  const { auctionInfo: { bids, lastBidId } } = auctionById(id)
  const initialIndex = Math.floor(1)
  // useOnNextRound()

  const formattedBids = bids.map((bid, i) => {
    return {
      id: bid.id,
      amount: new BigNumber(bid.amount.toString()),
      bidder: bid.bidder,
      previousBidAmount: bids[i - 1] && bids[i - 1].amount ? new BigNumber(bids[i - 1].amount.toString()) : BIG_ZERO,
    }
  })

  return (
    <Box overflowX='hidden' overflowY='auto' style={{ width: '100%' }}>
      <Menu id={id} />
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
          {formattedBids.map(bid => {
            return <SwiperSlide>
              <RoundCard bid={bid} id={id} bidId={bid.id} lastBidId={lastBidId} />
            </SwiperSlide>
          })}
          {bids.length > 0 ?
            <SwiperSlide>
              <IncreaseBidCard
                lastBid={formattedBids[bids.length - 1]}
                id={id}
                bidId={lastBidId + 1}
                setRefresh={setRefresh}
                refresh={refresh}
              />
            </SwiperSlide> :
            null
          }
          <SwiperSlide>
            <SoonRoundCard lastBidId={lastBidId} bidId={lastBidId + 1} id={id} />
          </SwiperSlide>
        </Swiper>
      </StyledSwiper>
    </Box>
  )
}

export default Positions
