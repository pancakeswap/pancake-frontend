import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useMatchBreakpoints } from '@pancakeswap-libs/uikit'
import { getWeb3NoAccount } from 'utils/web3'
import { setBlock } from 'state/block'
import { useGetPredictionsStatus, useInitializePredictions } from 'state/hooks'
import { PredictionStatus } from 'state/types'
import PageLoader from 'components/PageLoader'
import Container from './components/Container'
import SwiperProvider from './context/SwiperProvider'
import Desktop from './Desktop'
import Mobile from './Mobile'

const Predictions = () => {
  const [isInitialized, setIsInitialized] = useState(false)
  const { isLg, isXl } = useMatchBreakpoints()
  const status = useGetPredictionsStatus()
  const isDesktop = isLg || isXl
  const dispatch = useDispatch()

  useInitializePredictions()

  // Don't show UI until we are sure that we have a block number
  // This avoid the cards from jumping states
  useEffect(() => {
    const fetchBlockNumber = async () => {
      const web3 = getWeb3NoAccount()
      const blockNumber = await web3.eth.getBlockNumber()
      dispatch(setBlock(blockNumber))
      setIsInitialized(true)
    }

    fetchBlockNumber()
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
