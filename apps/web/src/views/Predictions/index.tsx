import { useModal, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useEffect, useRef } from 'react'
import { useChartView, useIsChartPaneOpen } from 'state/predictions/hooks'
import { PredictionsChartView } from 'state/types'
import { useAccountLocalEventListener } from 'hooks/useAccountLocalEventListener'
import { styled } from 'styled-components'
import { useUserPredictionChainlinkChartDisclaimerShow, useUserPredictionChartDisclaimerShow } from 'state/user/hooks'
import { PredictionSubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'

import ChartDisclaimer from './components/ChartDisclaimer'
import ChainlinkChartDisclaimer from './components/ChainlinkChartDisclaimer'
import CollectWinningsPopup from './components/CollectWinningsPopup'
import Container from './components/Container'
import RiskDisclaimer from './components/RiskDisclaimer'
import SwiperProvider from './context/SwiperProvider'
import Desktop from './Desktop'
import usePollPredictions from './hooks/usePollPredictions'
import Mobile from './Mobile'

const Decorations = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url(/images/pottery/bg-star.svg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  pointer-events: none;
  opacity: 0.2;
`

function Warnings() {
  const [showDisclaimer] = useUserPredictionChartDisclaimerShow()
  const [showChainlinkDisclaimer] = useUserPredictionChainlinkChartDisclaimerShow()
  const isChartPaneOpen = useIsChartPaneOpen()
  const chartView = useChartView()

  const [onPresentChartDisclaimer] = useModal(<ChartDisclaimer />, false)
  const [onPresentChainlinkChartDisclaimer] = useModal(<ChainlinkChartDisclaimer />, false)

  // TODO: memoize modal's handlers
  const onPresentChartDisclaimerRef = useRef(onPresentChartDisclaimer)
  const onPresentChainlinkChartDisclaimerRef = useRef(onPresentChainlinkChartDisclaimer)

  // Chart Disclaimer
  useEffect(() => {
    if (isChartPaneOpen && showDisclaimer && chartView === PredictionsChartView.TradingView) {
      onPresentChartDisclaimerRef.current()
    }
  }, [onPresentChartDisclaimerRef, isChartPaneOpen, showDisclaimer, chartView])

  // Chainlink Disclaimer
  useEffect(() => {
    if (isChartPaneOpen && showChainlinkDisclaimer && chartView === PredictionsChartView.Chainlink) {
      onPresentChainlinkChartDisclaimerRef.current()
    }
  }, [onPresentChainlinkChartDisclaimerRef, isChartPaneOpen, showChainlinkDisclaimer, chartView])

  return null
}

const Predictions = () => {
  const { isDesktop } = useMatchBreakpoints()

  useAccountLocalEventListener()

  usePollPredictions()

  return (
    <>
      <Warnings />
      <RiskDisclaimer />
      <SwiperProvider>
        <Container>
          <Decorations />
          {isDesktop ? <Desktop /> : <Mobile />}
          <CollectWinningsPopup />
        </Container>
      </SwiperProvider>
      <PredictionSubgraphHealthIndicator />
    </>
  )
}

export default Predictions
