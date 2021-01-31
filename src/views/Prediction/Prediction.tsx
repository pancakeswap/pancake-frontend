import React, { useEffect } from 'react'
import styled from 'styled-components'
import { setupWs } from 'utils/websocket-stream'
import Heading from './components/Heading'
import PredictionList from './components/PredictionList'
import TradingView from './components/TradingView'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px 32px 0;
  height: calc(100vh - 64px);
`
const Prediction: React.FC = () => {
  useEffect(() => {
    setupWs()
  }, [])

  return (
    <Container>
      <Heading />
      <PredictionList />
      <TradingView />
    </Container>
  )
}

export default Prediction
