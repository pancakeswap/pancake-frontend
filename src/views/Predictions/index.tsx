import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useMatchBreakpoints } from '@pancakeswap-libs/uikit'
import { getWeb3NoAccount } from 'utils/web3'
import { setBlock } from 'state/block'
import { useGetPredictionsStatus } from 'state/hooks'
import {
  getLatestRounds,
  getStaticPredictionsData,
  makeFutureRoundResponse,
  makeRoundData,
} from 'state/predictions/helpers'
import { initialize } from 'state/predictions'
import { RoundResponse } from 'state/predictions/queries'
import { PredictionsState, PredictionStatus } from 'state/types'
import PageLoader from 'components/PageLoader'
import Container from './components/Container'
import SwiperProvider from './context/SwiperProvider'
import Desktop from './Desktop'
import Mobile from './Mobile'

const FUTURE_ROUND_COUNT = 2

const Predictions = () => {
  const [isInitialized, setIsInitialized] = useState(false)
  const { isLg, isXl } = useMatchBreakpoints()
  const status = useGetPredictionsStatus()
  const isDesktop = isLg || isXl
  const dispatch = useDispatch()

  // Don't show UI until we have fetched the initial data sets
  useEffect(() => {
    const fetchInitialData = async () => {
      const web3 = getWeb3NoAccount()
      const [blockNumber, staticPredictionsData, latestRounds] = (await Promise.all([
        web3.eth.getBlockNumber(),
        getStaticPredictionsData(),
        getLatestRounds(),
      ])) as [number, Omit<PredictionsState, 'rounds'>, RoundResponse[]]

      const { currentEpoch, intervalBlocks, bufferBlocks } = staticPredictionsData
      const { startBlock } = latestRounds.find((roundResponse) => roundResponse.epoch === currentEpoch.toString())
      const currentRoundStartBlock = Number(startBlock)
      const futureRounds = []
      const halfInterval = (intervalBlocks + bufferBlocks) / 2

      for (let i = 1; i <= FUTURE_ROUND_COUNT; i++) {
        futureRounds.push(makeFutureRoundResponse(currentEpoch + i, (currentRoundStartBlock + halfInterval) * i))
      }

      const roundData = makeRoundData([...latestRounds, ...futureRounds])

      dispatch(setBlock(blockNumber))
      dispatch(
        initialize({
          ...staticPredictionsData,
          currentRoundStartBlockNumber: currentRoundStartBlock,
          rounds: roundData,
        }),
      )
      setIsInitialized(true)
    }

    fetchInitialData()
  }, [setIsInitialized, dispatch])

  if (status === PredictionStatus.INITIAL || !isInitialized) {
    return <PageLoader />
  }

  return (
    <SwiperProvider>
      <Container>{isDesktop ? <Desktop /> : <Mobile />}</Container>
    </SwiperProvider>
  )
}

export default Predictions
