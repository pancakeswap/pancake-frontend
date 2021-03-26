import React from 'react'
import styled from 'styled-components'
import { Box, Flex } from '@pancakeswap-libs/uikit'
import { useIsChartPaneOpen, useIsHistoryPaneOpen } from 'state/hooks'
import MobileMenu from './components/MobileMenu'
import History from './History'
import Positions from './Positions'
import Chart from './Chart'

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

  return (
    <StyledMobile>
      <Box height="100%">
        {view === PageView.POSITIONS && (
          <Flex alignItems="center" height="100%">
            <Positions />
          </Flex>
        )}
        {view === PageView.CHART && <Chart />}
        {view === PageView.HISTORY && <History />}
      </Box>
      <MobileMenu />
    </StyledMobile>
  )
}

export default Mobile
