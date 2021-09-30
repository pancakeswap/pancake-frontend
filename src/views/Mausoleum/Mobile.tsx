import React, { useState } from 'react'
import styled from 'styled-components'
import { ArrowDownIcon, Box, Button, ChartIcon, Flex, useModal } from '@rug-zombie-libs/uikit'
import { useGetPredictionsStatus, useIsChartPaneOpen, useIsHistoryPaneOpen } from 'state/hooks'
import SwiperCore, { Keyboard, Mousewheel } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { BigNumber } from 'bignumber.js'
import MobileMenu from './components/MobileMenu'
import useSwiper from './hooks/useSwiper'
import { BIG_ZERO } from '../../utils/bigNumber'
import SoonRoundCard from './components/RoundCard/SoonRoundCard'
import IncreaseBidCard from './components/RoundCard/IncreaseBidCard'
import RoundCard from './components/RoundCard'
import MobileTopMenu from './components/MobileTopMenu'
import { setChartPaneState } from '../../state/predictions'
import { useAppDispatch } from '../../state'
import { auctionById } from '../../redux/get'
import PrizeModal from './PrizeModal'
import AuctionEndCard from './components/RoundCard/AuctionEndCard'

enum PageView {
  POSITIONS = 'positions',
  HISTORY = 'history',
  CHART = 'chart',
}

const StyledMobile = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: none;
  }
`

const View = styled.div<{ isVisible: boolean }>`
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
`

const getView = (isHistoryPaneOpen: boolean, isChartPaneOpen: boolean): PageView => {
  if (isHistoryPaneOpen) {
    return PageView.HISTORY
  }

  if (isChartPaneOpen) {
    return PageView.CHART
  }

  return PageView.POSITIONS
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


const ChartPane = styled.div<{ isChartPaneOpen: boolean }>`
  height: ${({ isChartPaneOpen }) => (isChartPaneOpen ? '100%' : 0)};
  position: relative;
`

const ExpandChartButton = styled(Button)`
  background-color: ${({ theme }) => theme.card.background};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  color: ${({ theme }) => theme.colors.text};
  display: none;
  left: 32px;
  position: absolute;
  top: -32px;
  z-index: 50;

  &:hover:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled):not(:active) {
    background-color: ${({ theme }) => theme.card.background};
    opacity: 1;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    display: inline-flex;
  }
`

interface MobileProps {
  id: number,
  userInfo: any,
  aid: number,
  setRefresh: any,
  refresh: boolean
}

const Mobile: React.FC<MobileProps> = ({ refresh, setRefresh, userInfo, id }) => {
  const { setSwiper } = useSwiper()
  const isChartPaneOpen = useIsChartPaneOpen()
  const dispatch = useAppDispatch()
  const [refreshMob, setRefreshMob] = useState(false)
  const { auctionInfo: { bids, lastBidId, endDate } } = auctionById(id)
  const toggleChartPane = () => {
    dispatch(setChartPaneState(!isChartPaneOpen))
  }


  const [onPresentPrize] = useModal(
    <PrizeModal id={id} setSwiper={setSwiper} />,
  )

  const refreshMobile = () => {
    onPresentPrize()
    setRefreshMob(!refreshMob)
  }

  const formattedBids = bids.map((bid, i) => {
    return {
      id: bid.id,
      amount: new BigNumber(bid.amount.toString()),
      bidder: bid.bidder,
      previousBidAmount: bids[i - 1] && bids[i - 1].amount ? new BigNumber(bids[i - 1].amount.toString()) : BIG_ZERO,
    }
  })

  return (
    <>
      <StyledSwiper style={{ width: '100%' }}>
        <MobileTopMenu userInfo={userInfo} />

        <Swiper
          initialSlide={1}
          onSwiper={setSwiper}
          spaceBetween={16}
          slidesPerView='auto'
          freeMode
          direction='vertical'
          freeModeSticky
          centeredSlides
          mousewheel
          keyboard
          resizeObserver
        >
          <SwiperSlide>
            <SoonRoundCard lastBidId={lastBidId} bidId={lastBidId + 1} id={id} />
          </SwiperSlide>
          {bids.length > 0 ?
            <SwiperSlide>
              {Math.floor(Date.now() / 1000) > endDate ?
                <AuctionEndCard
                  lastBid={formattedBids[bids.length - 1]}
                  id={id}
                  bidId={lastBidId + 1}
                  setRefresh={setRefresh}
                  refresh={refresh}
                /> : <IncreaseBidCard
                  lastBid={formattedBids[bids.length - 1]}
                  id={id}
                  bidId={lastBidId + 1}
                  setRefresh={setRefresh}
                  refresh={refresh}
                />}
            </SwiperSlide> :
            null
          }
          {bids[lastBidId] ?
            <SwiperSlide>
              <RoundCard bid={formattedBids[lastBidId]} id={id} bidId={lastBidId} lastBidId={lastBidId}
              />
            </SwiperSlide> : null
          }
          {bids[lastBidId - 1] ?
            <SwiperSlide>
              <RoundCard bid={formattedBids[lastBidId - 1]} id={id} bidId={lastBidId - 1} lastBidId={lastBidId}
              />
            </SwiperSlide> : null
          }
          {bids[lastBidId - 2] ?
            <SwiperSlide>
              <RoundCard bid={formattedBids[lastBidId - 2]} id={id} bidId={lastBidId - 2} lastBidId={lastBidId} />
            </SwiperSlide> : null
          }
        </Swiper>
      </StyledSwiper>
      <div style={{
        position: 'fixed',
        zIndex: 100,
        bottom: '0',
        left: '0',
        width: '100%',
      }}>
        <ChartPane isChartPaneOpen={isChartPaneOpen}>
          <ExpandChartButton
            variant='tertiary'
            scale='sm'
            startIcon={isChartPaneOpen ? <ArrowDownIcon /> : <ChartIcon />}
            onClick={toggleChartPane}
          >
            {isChartPaneOpen ? 'Close' : 'Auction details'}
          </ExpandChartButton>
        </ChartPane>
        <MobileMenu id={id} refreshMobile={refreshMobile} />
      </div>
    </>
  )
}

export default Mobile
