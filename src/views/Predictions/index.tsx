import React from 'react'
import styled from 'styled-components'
import { useGetPredictionsStatus, useInitializePredictions, useIsHistoryPaneOpen } from 'state/hooks'
import { PredictionStatus } from 'state/types'
import PageLoader from 'components/PageLoader'
import Container from './components/Container'
import Positions from './Positions'
import History from './History'

const MainContent = styled.div<{ isActive: boolean }>`
  margin-right: ${({ isActive }) => (isActive ? '320px' : 0)};
  transition: 300ms ease-in-out;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-right: ${({ isActive }) => (isActive ? '384px' : 0)};
  }
`

const Pane = styled.div<{ isActive: boolean }>`
  background-color: ${({ theme }) => theme.card.background};
  box-shadow: -4px 0px 4px -8px rgba(14, 14, 44, 0.1);
  filter: drop-shadow(-1px 0px 1px rgba(0, 0, 0, 0.1));
  height: 100%;
  max-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  right: 0;
  top: 0;
  transition: 300ms ease-in-out;
  width: ${({ isActive }) => (isActive ? '320px' : 0)};
  z-index: 50;

  ${({ theme }) => theme.mediaQueries.lg} {
    width: ${({ isActive }) => (isActive ? '384px' : 0)};
  }
`

const Predictions = () => {
  const status = useGetPredictionsStatus()
  const isHistoryPaneOpen = useIsHistoryPaneOpen()

  useInitializePredictions()

  if (status === PredictionStatus.INITIAL) {
    return <PageLoader />
  }

  return (
    <Container>
      <MainContent isActive={isHistoryPaneOpen}>
        <Positions />
      </MainContent>
      <Pane isActive={isHistoryPaneOpen}>
        <History />
      </Pane>
    </Container>
  )
}

export default Predictions
