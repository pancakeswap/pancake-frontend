import React, { useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useMatchBreakpoints, useModal } from '@pancakeswap-libs/uikit'
import { useAppDispatch } from 'state'
import { useGetPredictionsStatus, useInitialBlock } from 'state/hooks'
import {
  getMarketData,
  getStaticPredictionsData,
  makeFutureRoundResponse,
  makeRoundData,
  transformRoundResponse,
} from 'state/predictions/helpers'
import { initialize, setPredictionStatus } from 'state/predictions'
import { HistoryFilter, PredictionsState, PredictionStatus } from 'state/types'
import usePersistState from 'hooks/usePersistState'
import PageLoader from 'components/PageLoader'
import usePollRoundData from './hooks/usePollRoundData'
import Container from './components/Container'
import CollectWinningsPopup from './components/CollectWinningsPopup'
import SwiperProvider from './context/SwiperProvider'
import Desktop from './Desktop'
import Mobile from './Mobile'
import RiskDisclaimer from './components/RiskDisclaimer'

const FUTURE_ROUND_COUNT = 2 // the number of rounds in the future to show

const Predictions = () => {
  const { isLg, isXl } = useMatchBreakpoints()
  const [hasAcceptedRisk, setHasAcceptedRisk] = usePersistState(false, 'pancake_predictions_accepted_risk')
  const status = useGetPredictionsStatus()
  const dispatch = useAppDispatch()
  const initialBlock = useInitialBlock()
  const isDesktop = isLg || isXl
  const handleAcceptRiskSuccess = () => setHasAcceptedRisk(true)
  const [onPresentRiskDisclaimer] = useModal(<RiskDisclaimer onSuccess={handleAcceptRiskSuccess} />, false)

  // TODO: memoize modal's handlers
  const onPresentRiskDisclaimerRef = useRef(onPresentRiskDisclaimer)

  useEffect(() => {
    if (!hasAcceptedRisk) {
      onPresentRiskDisclaimerRef.current()
    }
  }, [hasAcceptedRisk, onPresentRiskDisclaimerRef])

  useEffect(() => {
    const fetchInitialData = async () => {
      const [staticPredictionsData, marketData] = await Promise.all([getStaticPredictionsData(), getMarketData()])
      const { currentEpoch, intervalBlocks, bufferBlocks } = staticPredictionsData
      const latestRound = marketData.rounds.find((round) => round.epoch === currentEpoch)

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
  }, [initialBlock, dispatch])

  usePollRoundData()

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
