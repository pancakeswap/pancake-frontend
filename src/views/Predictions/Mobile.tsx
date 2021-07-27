import React from 'react'
import styled from 'styled-components'
import { Box, Flex } from '@rug-zombie-libs/uikit'
import { useGetPredictionsStatus, useIsChartPaneOpen, useIsHistoryPaneOpen } from 'state/hooks'
import { PredictionStatus } from 'state/types'
import MobileMenu from './components/MobileMenu'
import History from './History'
import Positions from './Positions'
import Chart from './Chart'
import { ErrorNotification, PauseNotification } from './components/Notification'
import MobileCard from './components/MobileCard/MobileCard'

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

interface MobileProps {
  bids: any[],
  lastBidId: number,
  userInfo: any,
  aid: number,
  setRefresh: any,
  refresh: boolean
}

const Mobile: React.FC<MobileProps> = ({ bids, refresh, lastBidId, setRefresh, userInfo, aid }) => {

  return <MobileCard  refresh={refresh} bids={bids} lastBidId={lastBidId} setRefresh={setRefresh} userInfo={userInfo} aid={aid}/>

}

export default Mobile
