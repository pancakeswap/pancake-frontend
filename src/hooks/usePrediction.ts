import { useState, useEffect } from 'react'
import { usePredictionBnb } from './useContract'

export const useCurrentEpoch = () => {
  const [epochInfo, setEpochInfo] = useState()
  const bnbPredictionContract = usePredictionBnb()

  useEffect(() => {
    bnbPredictionContract.events
      .BetBull()
      .on('connected', (event) => {
        console.log('event', event)
      })
      .on('data', (event) => {
        console.log(event)
      })
  }, [bnbPredictionContract])
}

export default {}
