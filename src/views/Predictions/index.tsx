import React from 'react'
import {
  useGetPredictionsStatus,
  useInitializePredictions,
  useIsChartPaneOpen,
  useIsHistoryPaneOpen,
} from 'state/hooks'
import { PredictionStatus } from 'state/types'
import PageLoader from 'components/PageLoader'
import Container from './components/Container'
import HistoryPane from './components/HistoryPane'
import MainContent from './MainContent'

const Predictions = () => {
  const status = useGetPredictionsStatus()
  const isHistoryPaneOpen = useIsHistoryPaneOpen()
  const isChartPaneOpen = useIsChartPaneOpen()

  useInitializePredictions()

  if (status === PredictionStatus.INITIAL) {
    return <PageLoader />
  }

  return (
    <Container>
      <MainContent isHistoryPaneOpen={isHistoryPaneOpen} isChartPaneOpen={isChartPaneOpen} />
      <HistoryPane isActive={isHistoryPaneOpen} />
    </Container>
  )
}

export default Predictions
