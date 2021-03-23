import React, { useEffect } from 'react'
import styled from 'styled-components'
import SwiperCore, { Keyboard, Mousewheel } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Box, Flex, HelpIcon, IconButton } from '@pancakeswap-libs/uikit'
import { useGetCurrentEpoch, useGetRounds } from 'state/hooks'
import { sortRounds } from './helpers'
import { PricePairLabel, TimerLabel } from './components/Label'
import PrevNextNav from './components/PrevNextNav'
import RoundCard from './components/RoundCard'
import HistoryButton from './components/HistoryButton'
import FlexRow from './components/FlexRow'

import 'swiper/swiper.min.css'
import useSwiper from './hooks/useSwiper'

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

const SetCol = styled.div`
  flex: none;
  width: auto;

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 270px;
  }
`

const HelpButtonWrapper = styled.div`
  order: 1;
  margin: 0 8px 0 0;

  ${({ theme }) => theme.mediaQueries.lg} {
    order: 2;
    margin: 0 0 0 8px;
  }
`

const TimerLabelWrapper = styled.div`
  order: 2;

  ${({ theme }) => theme.mediaQueries.lg} {
    order: 1;
  }
`

const HistoryButtonWrapper = styled.div`
  display: none;
  order: 3;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: initial;
  }
`

const Positions = () => {
  const { swiper, setSwiper } = useSwiper()
  const currentEpoch = useGetCurrentEpoch()
  const roundData = useGetRounds()
  const rounds = sortRounds(roundData, currentEpoch)
  const liveRoundIndex = rounds.findIndex((round) => round.epoch === currentEpoch)

  // When the epoch changes move to the live round
  useEffect(() => {
    if (swiper) {
      swiper.slideTo(liveRoundIndex)
    }
  }, [swiper, liveRoundIndex])

  return (
    <Box overflowX="hidden" overflowY="auto">
      <FlexRow alignItems="center" p="16px">
        <SetCol>
          <PricePairLabel />
        </SetCol>
        <FlexRow justifyContent="center">
          <PrevNextNav />
        </FlexRow>
        <SetCol>
          <Flex alignItems="center" justifyContent="flex-end">
            <TimerLabelWrapper>
              <TimerLabel interval="5m" />
            </TimerLabelWrapper>
            <HelpButtonWrapper>
              <IconButton variant="subtle">
                <HelpIcon width="24px" color="white" />
              </IconButton>
            </HelpButtonWrapper>
            <HistoryButtonWrapper>
              <HistoryButton />
            </HistoryButtonWrapper>
          </Flex>
        </SetCol>
      </FlexRow>
      <StyledSwiper>
        <Swiper
          initialSlide={liveRoundIndex >= 0 ? liveRoundIndex : 0}
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
