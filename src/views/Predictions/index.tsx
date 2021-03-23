import React from 'react'
import { useMatchBreakpoints } from '@pancakeswap-libs/uikit'
import { useGetPredictionsStatus, useInitializePredictions } from 'state/hooks'
import { PredictionStatus } from 'state/types'
import PageLoader from 'components/PageLoader'
import Container from './components/Container'
import SwiperProvider from './context/SwiperProvider'
import Desktop from './Desktop'
import Mobile from './Mobile'

const Predictions = () => {
  const { isLg, isXl } = useMatchBreakpoints()
  const status = useGetPredictionsStatus()
  const isDesktop = isLg || isXl

  useInitializePredictions()

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
