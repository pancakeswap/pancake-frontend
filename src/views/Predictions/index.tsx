import React from 'react'
import { useInitializePredictions } from 'state/hooks'
import Container from './components/Container'
import Positions from './Positions'

const Predictions = () => {
  useInitializePredictions()
  return (
    <Container>
      <Positions />
    </Container>
  )
}

export default Predictions
