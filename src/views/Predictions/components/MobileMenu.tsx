import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  ButtonMenu,
  ButtonMenuItem,
  ChartIcon,
  HistoryIcon,
  IconButton,
} from '@pancakeswap-libs/uikit'
import { useAppDispatch } from 'state'
import { useIsChartPaneOpen, useIsHistoryPaneOpen } from 'state/hooks'
import { setChartPaneState, setHistoryPaneState } from 'state/predictions'
import useSwiper from '../hooks/useSwiper'
import CardsIcon from '../icons/CardsIcon'

const ButtonNav = styled.div`
  flex: none;
`

const TabNav = styled.div`
  flex: 1;
  text-align: center;
`

const StyledMobileNavigation = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.card.background};
  display: flex;
  flex: none;
  height: 64px;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: none;
  }
`

const getActiveIndex = (isHistoryOpen: boolean, isChartOpen: boolean) => {
  if (isHistoryOpen) {
    return 2
  }

  if (isChartOpen) {
    return 1
  }

  return 0
}

const MobileNavigation = () => {
  const { swiper } = useSwiper()
  const isHistoryOpen = useIsHistoryPaneOpen()
  const isChartOpen = useIsChartPaneOpen()
  const activeIndex = getActiveIndex(isHistoryOpen, isChartOpen)
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()

  const handleItemClick = (index: number) => {
    switch (index) {
      case 2:
        dispatch(setHistoryPaneState(true))
        break
      case 1:
        dispatch(setChartPaneState(true))
        dispatch(setHistoryPaneState(false))
        break
      case 0:
      default:
        dispatch(setHistoryPaneState(false))
        dispatch(setChartPaneState(false))
    }
  }

  return (
    <StyledMobileNavigation>
      <ButtonNav>
        <IconButton variant="text" onClick={() => swiper.slidePrev()}>
          <ArrowBackIcon width="24px" color="primary" />
        </IconButton>
      </ButtonNav>
      <TabNav>
        <ButtonMenu activeIndex={activeIndex} scale="sm" variant="subtle" onItemClick={handleItemClick}>
          <ButtonMenuItem>
            <CardsIcon color="currentColor" />
          </ButtonMenuItem>
          <ButtonMenuItem>
            <ChartIcon color="currentColor" />
          </ButtonMenuItem>
          <ButtonMenuItem disabled={!account}>
            <HistoryIcon color="currentColor" />
          </ButtonMenuItem>
        </ButtonMenu>
      </TabNav>
      <ButtonNav>
        <IconButton variant="text" onClick={() => swiper.slideNext()}>
          <ArrowForwardIcon width="24px" color="primary" />
        </IconButton>
      </ButtonNav>
    </StyledMobileNavigation>
  )
}

export default MobileNavigation
