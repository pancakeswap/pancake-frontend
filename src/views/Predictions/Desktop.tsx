import { memo, useEffect, useRef } from 'react'
import styled from 'styled-components'
import Split, { SplitInstance } from 'split-grid'
import { Button, ChartIcon, Flex, Box } from '@pancakeswap/uikit'
import debounce from 'lodash/debounce'
import delay from 'lodash/delay'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import {
  useChartView,
  useGetPredictionsStatus,
  useIsChartPaneOpen,
  useIsHistoryPaneOpen,
} from 'state/predictions/hooks'
import { setChartPaneState, setChartView } from 'state/predictions'
import { PredictionsChartView, PredictionStatus } from 'state/types'
import dynamic from 'next/dynamic'
import { useTranslation } from '@pancakeswap/localization'
import { ChartByLabel } from 'components/Chart/ChartbyLabel'
import { TabToggle } from 'components/TabToggle'
import TradingView from './components/TradingView'
import { ErrorNotification, PauseNotification } from './components/Notification'
import History from './History'
import Positions from './Positions'
import { useConfig } from './context/ConfigProvider'
import LoadingSection from './components/LoadingSection'
import Menu from './components/Menu'

const ChainlinkChart = dynamic(() => import('./components/ChainlinkChart'), { ssr: false })

// The value to set the chart when the user clicks the chart tab at the bottom
const GRID_TEMPLATE_ROW = '1.2fr 24px .8fr'

const ExpandButtonGroup = styled(Flex)`
  bottom: 24px;
  left: 32px;
  position: absolute;
  display: none;
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: 24px 24px 0 0;
  z-index: 50;
  ${({ theme }) => theme.mediaQueries.lg} {
    display: inline-flex;
  }
`

const SplitWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 24px 0;
  flex: 1;
  overflow: hidden;
`

const ChartPane = styled.div`
  overflow: hidden;
  position: relative;
  background: ${({ theme }) => theme.colors.background};
`

const HistoryPane = styled.div<{ isHistoryPaneOpen: boolean; isChartPaneOpen: boolean }>`
  flex: none;
  overflow: hidden;
  transition: width 200ms ease-in-out;
  background: ${({ theme }) => theme.card.background};
  padding-bottom: ${({ isChartPaneOpen }) => (isChartPaneOpen ? 0 : '24px')};
  width: ${({ isHistoryPaneOpen }) => (isHistoryPaneOpen ? '384px' : 0)};
`

const StyledDesktop = styled.div`
  display: none;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: flex;
    height: calc(100vh - 100px);
  }
`

const PositionPane = styled.div`
  align-items: center;
  display: flex;
  max-width: 100%;
  overflow-y: auto;
  overflow-x: hidden;

  & > div {
    flex: 1;
    overflow: hidden;
  }
`

const Gutter = styled.div<{ isChartPaneOpen?: boolean }>`
  background: ${({ theme }) => theme.card.background};
  cursor: ${({ isChartPaneOpen }) => (isChartPaneOpen ? 'row-resize' : 'pointer')};
  height: 24px;
  position: relative;

  &:before {
    background-color: ${({ theme }) => theme.colors.textSubtle};
    border-radius: 8px;
    content: '';
    height: 4px;
    left: 50%;
    margin-left: -32px;
    position: absolute;
    top: 10px;
    width: 64px;
  }
`

const PowerLinkStyle = styled.div`
  position: absolute;
  right: 16px;
  top: -40px;
`

const Desktop: React.FC<React.PropsWithChildren> = () => {
  const splitWrapperRef = useRef<HTMLDivElement>()
  const chartRef = useRef<HTMLDivElement>()
  const gutterRef = useRef<HTMLDivElement>()
  const isHistoryPaneOpen = useIsHistoryPaneOpen()
  const isChartPaneOpen = useIsChartPaneOpen()
  const chartView = useChartView()
  const dispatch = useLocalDispatch()
  const { t } = useTranslation()
  const status = useGetPredictionsStatus()
  const { token } = useConfig()

  const openChartPane = () => {
    splitWrapperRef.current.style.transition = 'grid-template-rows 150ms'
    splitWrapperRef.current.style.gridTemplateRows = GRID_TEMPLATE_ROW

    // Purely comedic: We only want to animate if we are clicking the open chart button
    // If we keep the transition on the resizing becomes very choppy
    delay(() => {
      splitWrapperRef.current.style.transition = ''
    }, 150)

    dispatch(setChartPaneState(true))
  }

  const splitInstance = useRef<SplitInstance>()

  useEffect(() => {
    const { height } = chartRef.current.getBoundingClientRect()

    if (height > 0 && !isChartPaneOpen) {
      dispatch(setChartPaneState(true))
    }
  }, [isChartPaneOpen, dispatch])

  // unmount
  useEffect(() => {
    return () => {
      dispatch(setChartPaneState(false))
    }
  }, [dispatch])

  useEffect(() => {
    const threshold = 100
    const handleDrag = debounce(() => {
      const { height } = chartRef.current.getBoundingClientRect()

      // If the height of the chart pane goes below the "snapOffset" threshold mark the chart pane as closed
      dispatch(setChartPaneState(height > threshold))
    }, 50)

    if (isChartPaneOpen && !splitInstance.current) {
      splitInstance.current = Split({
        dragInterval: 1,
        snapOffset: threshold,
        onDrag: handleDrag,
        rowGutters: [
          {
            track: 1,
            element: gutterRef.current,
          },
        ],
      })
    } else if (!isChartPaneOpen && splitInstance.current) {
      splitInstance.current?.destroy()
      splitInstance.current = undefined
    }

    return () => {
      splitInstance.current?.destroy()
      splitInstance.current = undefined
    }
  }, [gutterRef, chartRef, dispatch, isChartPaneOpen])

  return (
    <>
      <StyledDesktop>
        <SplitWrapper ref={splitWrapperRef}>
          <PositionPane>
            {status === PredictionStatus.ERROR && <ErrorNotification />}
            {status === PredictionStatus.PAUSED && <PauseNotification />}
            {[PredictionStatus.INITIAL, PredictionStatus.LIVE].includes(status) && (
              <Box>
                <Menu />
                {status === PredictionStatus.LIVE ? <Positions /> : <LoadingSection />}
              </Box>
            )}
          </PositionPane>

          <Gutter
            ref={gutterRef}
            isChartPaneOpen={isChartPaneOpen}
            onClick={() => {
              openChartPane()
            }}
          >
            <PowerLinkStyle>
              <img src="/images/powered-by-chainlink.png" alt="Powered by ChainLink" width="170px" height="48px" />
            </PowerLinkStyle>
            <ExpandButtonGroup>
              <TabToggle
                height="42px"
                as={Button}
                style={{ whiteSpace: 'nowrap', alignItems: 'center' }}
                isActive={chartView === PredictionsChartView.TradingView}
                onMouseDown={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  dispatch(setChartView(PredictionsChartView.TradingView))
                }}
              >
                {chartView === PredictionsChartView.TradingView && <ChartIcon mr="10px" />} TradingView {t('Chart')}
              </TabToggle>
              <TabToggle
                as={Button}
                height="42px"
                style={{ whiteSpace: 'nowrap', alignItems: 'center' }}
                isActive={chartView === PredictionsChartView.Chainlink}
                onMouseDown={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  dispatch(setChartView(PredictionsChartView.Chainlink))
                }}
              >
                {chartView === PredictionsChartView.Chainlink && <ChartIcon mr="10px" />} Chainlink {t('Chart')}
              </TabToggle>
            </ExpandButtonGroup>
            {isChartPaneOpen && (
              <ChartByLabel
                justifyContent="flex-end"
                symbol={`${token.symbol}/USD`}
                by={chartView}
                linkProps={{
                  onMouseDown: (e) => {
                    window.open(
                      chartView === PredictionsChartView.TradingView
                        ? `https://www.tradingview.com/chart/?symbol=BINANCE%3A${token.symbol}USD`
                        : 'https://chain.link/data-feeds',
                      '_blank',
                      'noopener noreferrer',
                    )
                    e.stopPropagation()
                    e.preventDefault()
                  },
                }}
                link={
                  chartView === PredictionsChartView.TradingView
                    ? `https://www.tradingview.com/chart/?symbol=BINANCE%3A${token.symbol}USD`
                    : 'https://chain.link/data-feeds'
                }
              />
            )}
          </Gutter>
          <ChartPane ref={chartRef}>
            {isChartPaneOpen && (chartView === PredictionsChartView.TradingView ? <TradingView /> : <ChainlinkChart />)}
          </ChartPane>
        </SplitWrapper>
        <HistoryPane isHistoryPaneOpen={isHistoryPaneOpen} isChartPaneOpen={isChartPaneOpen}>
          <History />
        </HistoryPane>
      </StyledDesktop>
    </>
  )
}

export default memo(Desktop)
