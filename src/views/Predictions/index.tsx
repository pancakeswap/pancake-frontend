import React, { useEffect } from 'react'
import { useAppDispatch } from 'state'
import { useMatchBreakpoints } from '@pancakeswap-libs/uikit'
import { useGetPredictionsStatus, useInitialBlock } from 'state/hooks'
import {
  getLatestRounds,
  getStaticPredictionsData,
  makeFutureRoundResponse,
  makeRoundData,
} from 'state/predictions/helpers'
import { initialize } from 'state/predictions'
import { RoundResponse } from 'state/predictions/queries'
import { HistoryFilter, PredictionsState, PredictionStatus } from 'state/types'
import PageLoader from 'components/PageLoader'
import Container from './components/Container'
import SwiperProvider from './context/SwiperProvider'
import Desktop from './Desktop'
import Mobile from './Mobile'

const FUTURE_ROUND_COUNT = 2 // the number of rounds in the future to show

const Predictions = () => {
  const { isLg, isXl } = useMatchBreakpoints()
  const status = useGetPredictionsStatus()
  const dispatch = useAppDispatch()
  const initialBlock = useInitialBlock()
  const isDesktop = isLg || isXl

  useEffect(() => {
    const fetchInitialData = async () => {
      const [staticPredictionsData, latestRounds] = (await Promise.all([
        getStaticPredictionsData(),
        getLatestRounds(),
      ])) as [Omit<PredictionsState, 'rounds'>, RoundResponse[]]

      const { currentEpoch, intervalBlocks, bufferBlocks } = staticPredictionsData
      const { startBlock } = latestRounds.find((roundResponse) => roundResponse.epoch === currentEpoch.toString())
      const currentRoundStartBlock = Number(startBlock)
      const futureRounds = []
      const halfInterval = (intervalBlocks + bufferBlocks) / 2

      for (let i = 1; i <= FUTURE_ROUND_COUNT; i++) {
        futureRounds.push(makeFutureRoundResponse(currentEpoch + i, (currentRoundStartBlock + halfInterval) * i))
      }

      const roundData = makeRoundData([...latestRounds, ...futureRounds])

      dispatch(
        initialize({
          ...staticPredictionsData,
          historyFilter: HistoryFilter.ALL,
          currentRoundStartBlockNumber: currentRoundStartBlock,
          rounds: roundData,
          bets: {},
        }),
      )
    }

    // Do not start initialization until the first block has been retrieved
    if (initialBlock > 0) {
      fetchInitialData()
    }
  }, [initialBlock, dispatch])

  if (status === PredictionStatus.INITIAL) {
    return <PageLoader />
  }

  return (
    <SwiperProvider>
      <Container>{isDesktop ? <Desktop /> : <Mobile />}</Container>
    </SwiperProvider>
  )
}

export default Predictions
