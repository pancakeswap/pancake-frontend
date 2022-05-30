import { useMatchBreakpoints, useModal } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { PageMeta } from 'components/Layout/Page'
import PageLoader from 'components/Loader/PageLoader'
import { useEffect, useRef } from 'react'
import { useInitialBlock } from 'state/block/hooks'
import { initializePredictions } from 'state/predictions'
import { useChartView, useGetPredictionsStatus, useIsChartPaneOpen } from 'state/predictions/hooks'
import { useAccountLocalEventListener } from 'hooks/useAccountLocalEventListener'
import { PredictionsChartView, PredictionStatus } from 'state/types'
import {
  useUserPredictionAcceptedRisk,
  useUserPredictionChainlinkChartDisclaimerShow,
  useUserPredictionChartDisclaimerShow,
} from 'state/user/hooks'
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
  const [hasAcceptedRisk, setHasAcceptedRisk] = useUserPredictionAcceptedRisk()
  const [showDisclaimer] = useUserPredictionChartDisclaimerShow()
  const [showChainlinkDisclaimer] = useUserPredictionChainlinkChartDisclaimerShow()
  const isChartPaneOpen = useIsChartPaneOpen()
  const chartView = useChartView()
  const handleAcceptRiskSuccess = () => setHasAcceptedRisk(true)

  const [onPresentRiskDisclaimer] = useModal(<RiskDisclaimer onSuccess={handleAcceptRiskSuccess} />, false)
  const [onPresentChartDisclaimer] = useModal(<ChartDisclaimer />, false)
  const [onPresentChainlinkChartDisclaimer] = useModal(<ChainlinkChartDisclaimer />, false)

  // TODO: memoize modal's handlers
  const onPresentRiskDisclaimerRef = useRef(onPresentRiskDisclaimer)
  const onPresentChartDisclaimerRef = useRef(onPresentChartDisclaimer)
  const onPresentChainlinkChartDisclaimerRef = useRef(onPresentChainlinkChartDisclaimer)

  // Disclaimer
  useEffect(() => {
    if (!hasAcceptedRisk) {
      onPresentRiskDisclaimerRef.current()
    }
  }, [hasAcceptedRisk, onPresentRiskDisclaimerRef])

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
  const status = useGetPredictionsStatus()
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

  if (status === PredictionStatus.INITIAL) {
    return <PageLoader />
  }

  return (
    <>
      <PageMeta />
      <Warnings />
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
