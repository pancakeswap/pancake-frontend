import { memo } from 'react'
import styled from 'styled-components'
import { Box, Flex, Link } from '@pancakeswap/uikit'
import { useGetPredictionsStatus, useIsChartPaneOpen, useIsHistoryPaneOpen } from 'state/predictions/hooks'
import { PredictionStatus } from 'state/types'
import MobileMenu from './components/MobileMenu'
import History from './History'
import Positions from './Positions'
import MobileChart from './MobileChart'
import { ErrorNotification, PauseNotification } from './components/Notification'
import { PageView } from './types'
import Menu from './components/Menu'
import LoadingSection from './components/LoadingSection'

const StyledMobile = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;

  ${({ theme }) => theme.mediaQueries.xl} {
    display: none;
  }
`

const PowerLinkStyle = styled(Link)`
  display: flex;
  justify-content: flex-end;
  margin-right: 16px;
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

const Mobile: React.FC<React.PropsWithChildren> = () => {
  const isHistoryPaneOpen = useIsHistoryPaneOpen()
  const isChartPaneOpen = useIsChartPaneOpen()
  const view = getView(isHistoryPaneOpen, isChartPaneOpen)
  const status = useGetPredictionsStatus()

  return (
    <StyledMobile>
      <Box height="100%">
        {view === PageView.POSITIONS && (
          <Flex justifyContent="center" alignItems="center" flexDirection="column" minHeight="100%">
            {status === PredictionStatus.ERROR && <ErrorNotification />}
            {status === PredictionStatus.PAUSED && <PauseNotification />}
            {[PredictionStatus.INITIAL, PredictionStatus.LIVE].includes(status) && (
              <Box width="100%">
                <Menu />
                {status === PredictionStatus.LIVE ? <Positions view={view} /> : <LoadingSection />}
                <PowerLinkStyle href="https://chain.link/" external>
                  <img
                    src="/images/powered-by-chainlink.svg"
                    alt="Powered by ChainLink"
                    style={{ width: '170px', maxHeight: '100%' }}
                  />
                </PowerLinkStyle>
              </Box>
            )}
          </Flex>
        )}
        {view === PageView.CHART && <MobileChart />}
        {view === PageView.HISTORY && <History />}
      </Box>
      <MobileMenu />
    </StyledMobile>
  )
}

export default memo(Mobile)
