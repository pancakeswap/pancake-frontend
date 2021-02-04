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
  align-items: center;
  padding: 32px 32px 0;
  margin: 0 auto;
  max-width: 100%;
  height: calc(100vh - 64px);
  > div {
    width: 100%;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    max-width: calc(100vw - 240px);
  }
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
