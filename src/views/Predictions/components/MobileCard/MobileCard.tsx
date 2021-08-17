import React from 'react'
import { BigNumber } from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import SwiperCore, { Keyboard, Mousewheel } from 'swiper'
import styled from 'styled-components'
import { Swiper, SwiperSlide } from 'swiper/react'
import SoonRoundCard from '../RoundCard/SoonRoundCard'
import './cardStyles.css'
import IncreaseBidCard from '../RoundCard/IncreaseBidCard'
import RoundCard from '../RoundCard'
import useSwiper from '../../hooks/useSwiper'

interface MobileCardProps {
  bids: any[],
  lastBidId: number,
  userInfo: any,
  aid: number,
  id: number,
  setRefresh: any,
  refresh: boolean
}

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

const MobileCard: React.FC<MobileCardProps> = ({ bids, id, refresh, lastBidId, setRefresh, userInfo }) => {
  const { setSwiper } = useSwiper()

  const formattedBids = bids.map((bid, i) => {
    return {
      amount: new BigNumber(bid.amount.toString()),
      bidder: bid.bidder,
      previousBidAmount: bids[i - 1] && bids[i - 1].amount ? new BigNumber(bids[i - 1].amount.toString()) : BIG_ZERO,
    }
  })

  return (
    <>
      <StyledSwiper style={{ width: '100%' }}>
        <Swiper
          initialSlide={0}
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
          <SoonRoundCard lastBidId={lastBidId} id={id} bidId={lastBidId + 1} />
          {bids.length > 0 ?
            <IncreaseBidCard
              lastBid={formattedBids[bids.length - 1]}
              bidId={lastBidId}
              id={id}
              setRefresh={setRefresh}
              refresh={refresh}
            /> :
            null
          }
          {bids[lastBidId - 1] ?
            <RoundCard bid={formattedBids[lastBidId - 1]} id={id} bidId={lastBidId - 1} lastBidId={lastBidId} /> : null
          }
          {bids[lastBidId - 2] ?
            <RoundCard bid={formattedBids[lastBidId - 2]} id={id} bidId={lastBidId - 2} lastBidId={lastBidId}/> : null
          }
          {bids[lastBidId - 3] ?
            <RoundCard bid={formattedBids[lastBidId - 3]} id={id} bidId={lastBidId - 3} lastBidId={lastBidId}/> : null
          }
        </Swiper>
      </StyledSwiper>
    </>
  )
}

export default MobileCard
