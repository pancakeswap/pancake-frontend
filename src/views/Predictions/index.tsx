import React, { useEffect, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Helmet } from 'react-helmet-async'
import { useMatchBreakpoints, useModal } from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import { useGetPredictionsStatus, useInitialBlock, useIsChartPaneOpen } from 'state/hooks'
import {
  getMarketData,
  getStaticPredictionsData,
  makeFutureRoundResponse,
  makeRoundData,
  transformRoundResponse,
} from 'state/predictions/helpers'
import { fetchCurrentBets, initialize, setPredictionStatus } from 'state/predictions'
import { HistoryFilter, PredictionsState, PredictionStatus } from 'state/types'
import usePersistState from 'hooks/usePersistState'
import PageLoader from 'components/PageLoader'
import usePollOraclePrice from './hooks/usePollOraclePrice'
import usePollRoundData from './hooks/usePollRoundData'
import Container from './components/Container'
import CollectWinningsPopup from './components/CollectWinningsPopup'
import SwiperProvider from './context/SwiperProvider'
import Desktop from './Desktop'
import Mobile from './Mobile'
import RiskDisclaimer from './components/RiskDisclaimer'
import ChartDisclaimer from './components/ChartDisclaimer'

const FUTURE_ROUND_COUNT = 2 // the number of rounds in the future to show

const Predictions = () => {
  const { isXl } = useMatchBreakpoints()
  const [hasAcceptedRisk, setHasAcceptedRisk] = usePersistState(false, 'pancake_predictions_accepted_risk')
  const [hasAcceptedChart, setHasAcceptedChart] = usePersistState(false, 'pancake_predictions_chart')
  const { account } = useWeb3React()
  const status = useGetPredictionsStatus()
  const isChartPaneOpen = useIsChartPaneOpen()
  const dispatch = useAppDispatch()
  const initialBlock = useInitialBlock()
  const isDesktop = isXl
  const handleAcceptRiskSuccess = () => setHasAcceptedRisk(true)
  const handleAcceptChart = () => setHasAcceptedChart(true)
  const [onPresentRiskDisclaimer] = useModal(<RiskDisclaimer onSuccess={handleAcceptRiskSuccess} />, false)
  const [onPresentChartDisclaimer] = useModal(<ChartDisclaimer onSuccess={handleAcceptChart} />, false)

  // TODO: memoize modal's handlers
  const onPresentRiskDisclaimerRef = useRef(onPresentRiskDisclaimer)
  const onPresentChartDisclaimerRef = useRef(onPresentChartDisclaimer)

  // Disclaimer
  useEffect(() => {
    if (!hasAcceptedRisk) {
      onPresentRiskDisclaimerRef.current()
    }
  }, [hasAcceptedRisk, onPresentRiskDisclaimerRef])

  // Chart Disclaimer
  useEffect(() => {
    if (!hasAcceptedChart && isChartPaneOpen) {
      onPresentChartDisclaimerRef.current()
    }
  }, [onPresentChartDisclaimerRef, hasAcceptedChart, isChartPaneOpen])

  useEffect(() => {
    const fetchInitialData = async () => {
      const [staticPredictionsData, marketData] = await Promise.all([getStaticPredictionsData(), getMarketData()])
      const { currentEpoch, intervalBlocks, bufferBlocks } = staticPredictionsData
      const latestRound = marketData.rounds.find((round) => round.epoch === currentEpoch)

      // Fetch data on current unclaimed bets
      dispatch(fetchCurrentBets({ account, roundIds: marketData.rounds.map((round) => round.id) }))

      if (marketData.market.paused) {
        dispatch(setPredictionStatus(PredictionStatus.PAUSED))
      } else if (latestRound && latestRound.epoch === currentEpoch) {
        const currentRoundStartBlock = Number(latestRound.startBlock)
        const futureRounds = []
        const halfInterval = (intervalBlocks + bufferBlocks) / 2

        for (let i = 1; i <= FUTURE_ROUND_COUNT; i++) {
          futureRounds.push(makeFutureRoundResponse(currentEpoch + i, (currentRoundStartBlock + halfInterval) * i))
        }

        const roundData = makeRoundData([...marketData.rounds, ...futureRounds.map(transformRoundResponse)])

        dispatch(
          initialize({
            ...(staticPredictionsData as Omit<PredictionsState, 'rounds'>),
            historyFilter: HistoryFilter.ALL,
            currentRoundStartBlockNumber: currentRoundStartBlock,
            rounds: roundData,
            history: {},
            bets: {},
          }),
        )
      } else {
        // If the latest epoch from the API does not match the latest epoch from the contract we have an unrecoverable error
        dispatch(setPredictionStatus(PredictionStatus.ERROR))
      }
    }

    // Do not start initialization until the first block has been retrieved
    if (initialBlock > 0) {
      fetchInitialData()
    }
  }, [initialBlock, dispatch, account])

  usePollRoundData()
  usePollOraclePrice()

  if (status === PredictionStatus.INITIAL) {
    return <PageLoader />
  }

  return (
    <>
      <Helmet>
        <script src="https://s3.tradingview.com/tv.js" type="text/javascript" id="tradingViewWidget" />
      </Helmet>
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
