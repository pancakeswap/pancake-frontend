import React, { useEffect } from 'react'
import styled from 'styled-components'
import { setupWs } from 'utils/websocket-stream'
import Heading from './components/Heading'
import PredictionList from './components/PredictionList'
import TradingView from './components/TradingView'
import PredictionProvider from './contexts/PredictionProvider'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px 32px 0;
  height: calc(100vh - 64px);
`
const Prediction: React.FC = () => {
  useEffect(() => {
    const unSubscribe = setupWs()
    return unSubscribe
  }, [])

  return (
    <Container>
      <PredictionProvider>
        <Heading />
        <PredictionList />
        <TradingView />
      </PredictionProvider>
    </Container>
  )
}

export default Prediction
