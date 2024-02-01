import { PredictionStatus } from '@pancakeswap/prediction'
import { Box, Flex, Link } from '@pancakeswap/uikit'
import { memo } from 'react'
import { useGetPredictionsStatus, useIsChartPaneOpen, useIsHistoryPaneOpen } from 'state/predictions/hooks'
import { styled } from 'styled-components'
import History from './History'
import MobileChart from './MobileChart'
import Positions from './Positions'
import LoadingSection from './components/LoadingSection'
import Menu from './components/Menu'
import MobileMenu from './components/MobileMenu'
import { ErrorNotification, PauseNotification } from './components/Notification'
import { useConfig } from './context/ConfigProvider'
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
  const config = useConfig()

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
                {config?.chainlinkOracleAddress && (
                  <Flex justifyContent="right">
                    <PowerLinkStyle href="https://chain.link/" external>
                      <img
                        src="/images/powered-by-chainlink.svg"
                        alt="Powered by ChainLink"
                        style={{ width: '170px', maxHeight: '100%' }}
                      />
                    </PowerLinkStyle>
                  </Flex>
                )}
                {config?.galetoOracleAddress && (
                  <Flex justifyContent="right">
                    <PowerLinkStyle href="https://pyth.network/" external>
                      <img
                        src="/images/powered-by-pyth.svg"
                        alt="Powered by PYTH"
                        style={{ width: '170px', maxHeight: '100%' }}
                      />
                    </PowerLinkStyle>
                  </Flex>
                )}
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
