import { useModal, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { PageMeta } from 'components/Layout/Page'
import { useEffect, useRef } from 'react'
import { useInitialBlock } from 'state/block/hooks'
import { initializePredictions } from 'state/predictions'
import { useChartView, useIsChartPaneOpen } from 'state/predictions/hooks'
import { PredictionsChartView } from 'state/types'
import { useAccountLocalEventListener } from 'hooks/useAccountLocalEventListener'
import { useUserPredictionChainlinkChartDisclaimerShow, useUserPredictionChartDisclaimerShow } from 'state/user/hooks'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'

import ChartDisclaimer from './components/ChartDisclaimer'
import ChainlinkChartDisclaimer from './components/ChainlinkChartDisclaimer'
import CollectWinningsPopup from './components/CollectWinningsPopup'
import Container from './components/Container'
import RiskDisclaimer from './components/RiskDisclaimer'
import SwiperProvider from './context/SwiperProvider'
import Desktop from './Desktop'
import usePollPredictions from './hooks/usePollPredictions'
import Mobile from './Mobile'

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
  const { account } = useWeb3React()
  const dispatch = useLocalDispatch()
  const initialBlock = useInitialBlock()

  useAccountLocalEventListener()

  useEffect(() => {
    if (initialBlock > 0) {
      // Do not start initialization until the first block has been retrieved
      dispatch(initializePredictions(account))
    }
  }, [initialBlock, dispatch, account])

  usePollPredictions()

  return (
    <>
      <PageMeta />
      <Warnings />
      <RiskDisclaimer />
      <SwiperProvider>
        <Container>
          {isDesktop ? <Desktop /> : <Mobile />}
          <CollectWinningsPopup />
        </Container>
      </SwiperProvider>
    </>
  )
}

export default Predictions
