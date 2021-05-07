import React from 'react'
import styled from 'styled-components'
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

const PositionsPane = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  min-height: 506px;
`

const HistoryPane = styled.div<{ isHistoryPaneOpen: boolean }>`
  flex: none;
  overflow: hidden;
  transition: width 200ms ease-in-out;
  width: ${({ isHistoryPaneOpen }) => (isHistoryPaneOpen ? '384px' : 0)};
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

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
`

const StyledDesktop = styled.div`
  display: none;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: flex;
    height: 100%;
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
      <ContentWrapper>
        {status === PredictionStatus.ERROR && <ErrorNotification />}
        {status === PredictionStatus.PAUSED && <PauseNotification />}
        {status === PredictionStatus.LIVE && (
          <>
            <PositionsPane>
              <Positions />
            </PositionsPane>
            <ChartPane isChartPaneOpen={isChartPaneOpen}>
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
          </>
        )}
      </ContentWrapper>
      <HistoryPane isHistoryPaneOpen={isHistoryPaneOpen}>
        <History />
      </HistoryPane>
    </StyledDesktop>
  )
}

export default Desktop
