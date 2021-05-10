import React from 'react'
import styled from 'styled-components'
import Split from 'react-split-grid'
import { useAppDispatch } from 'state'
import { ArrowDownIcon, Button, ChartIcon } from '@pancakeswap/uikit'
import { useGetPredictionsStatus, useIsChartPaneOpen, useIsHistoryPaneOpen } from 'state/hooks'
import { setChartPaneState } from 'state/predictions'
import { PredictionStatus } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import TradingView from './components/TradingView'
import { ErrorNotification, PauseNotification } from './components/Notification'
import History from './History'
import Positions from './Positions'

const HistoryPane = styled.div<{ isHistoryPaneOpen: boolean }>`
  flex: none;
  overflow: hidden;
  transition: width 200ms ease-in-out;
  width: ${({ isHistoryPaneOpen }) => (isHistoryPaneOpen ? '384px' : 0)};
`

const ChartPane = styled.div`
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

const SplitWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 12px 1fr;
  flex: 1;
  overflow: hidden;
`

const StyledDesktop = styled.div`
  display: none;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: flex;
    height: 100%;
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

const Gutter = styled.div`
  background: ${({ theme }) => theme.colors.dropdown};
  cursor: row-resize;
  height: 12px;
  position: relative;

  &:before {
    background-color: ${({ theme }) => theme.colors.secondary};
    border-radius: 8px;
    content: '';
    height: 4px;
    left: 50%;
    margin-left: -32px;
    position: absolute;
    top: 4px;
    width: 64px;
  }
`

const Desktop: React.FC = () => {
  const isHistoryPaneOpen = useIsHistoryPaneOpen()
  const isChartPaneOpen = useIsChartPaneOpen()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const status = useGetPredictionsStatus()

  const toggleChartPane = () => {
    dispatch(setChartPaneState(!isChartPaneOpen))
  }

  return (
    <StyledDesktop>
      <Split
        render={({ getGridProps, getGutterProps }) => (
          <SplitWrapper {...getGridProps()}>
            <PositionPane>
              <div>
                {status === PredictionStatus.ERROR && <ErrorNotification />}
                {status === PredictionStatus.PAUSED && <PauseNotification />}
                {status === PredictionStatus.LIVE && <Positions />}
              </div>
            </PositionPane>
            <Gutter {...getGutterProps('row', 1)} />
            <ChartPane>
              <ExpandChartButton
                variant="tertiary"
                scale="sm"
                startIcon={isChartPaneOpen ? <ArrowDownIcon /> : <ChartIcon />}
                onClick={toggleChartPane}
              >
                {isChartPaneOpen ? t('Close') : t('Charts')}
              </ExpandChartButton>
              <TradingView />
            </ChartPane>
          </SplitWrapper>
        )}
      />
      <HistoryPane isHistoryPaneOpen={isHistoryPaneOpen}>
        <History />
      </HistoryPane>
    </StyledDesktop>
  )
}

export default Desktop
