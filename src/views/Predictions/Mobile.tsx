import React from 'react'
import styled from 'styled-components'
import { Box, Flex } from '@pancakeswap/uikit'
import { useGetPredictionsStatus, useIsChartPaneOpen, useIsHistoryPaneOpen } from 'state/predictions/hooks'
import { PredictionStatus } from 'state/types'
import MobileMenu from './components/MobileMenu'
import History from './History'
import Positions from './Positions'
import Chart from './Chart'
import { ErrorNotification, PauseNotification } from './components/Notification'
import { PageView } from './types'

const StyledMobile = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;

  ${({ theme }) => theme.mediaQueries.xl} {
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

const Mobile: React.FC = () => {
  const isHistoryPaneOpen = useIsHistoryPaneOpen()
  const isChartPaneOpen = useIsChartPaneOpen()
  const view = getView(isHistoryPaneOpen, isChartPaneOpen)
  const status = useGetPredictionsStatus()

  return (
    <StyledMobile>
      <Box height="100%" overflow="hidden" position="relative">
        <View isVisible={view === PageView.POSITIONS}>
          <Flex alignItems="center" height="100%">
            {status === PredictionStatus.ERROR && <ErrorNotification />}
            {status === PredictionStatus.PAUSED && <PauseNotification />}
            {status === PredictionStatus.LIVE && <Positions view={view} />}
          </Flex>
        </View>
        <View isVisible={view === PageView.CHART}>
          <Chart />
        </View>
        <View isVisible={view === PageView.HISTORY}>
          <History />
        </View>
      </Box>
      <MobileMenu />
    </StyledMobile>
  )
}

export default Mobile
