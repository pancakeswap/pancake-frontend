import PageLoader from 'components/PageLoader'
import React from 'react'
import { useGetPredictionsStatus, useInitializePredictions } from 'state/hooks'
import { PredictionStatus } from 'state/types'
import Container from './components/Container'
import Positions from './Positions'

const Predictions = () => {
  const status = useGetPredictionsStatus()

  useInitializePredictions()

  if (status === PredictionStatus.INITIAL) {
    return <PageLoader />
  }

  return (
    <Container>
      <Positions />
    </Container>
  )
}

export default Predictions
