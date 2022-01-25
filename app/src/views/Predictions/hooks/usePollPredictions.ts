import { useEffect, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { useGetCurrentEpoch, useGetEarliestEpoch, useGetPredictionsStatus } from 'state/predictions/hooks'
import { fetchClaimableStatuses, fetchLedgerData, fetchMarketData, fetchRounds } from 'state/predictions'
import { PredictionStatus } from 'state/types'
import range from 'lodash/range'

const POLL_TIME_IN_SECONDS = 10

const usePollPredictions = () => {
  const timer = useRef<NodeJS.Timeout>(null)
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const currentEpoch = useGetCurrentEpoch()
  const earliestEpoch = useGetEarliestEpoch()
  const status = useGetPredictionsStatus()

  useEffect(() => {
    // Clear old timer
    if (timer.current) {
      clearInterval(timer.current)
    }

    if (status !== PredictionStatus.INITIAL) {
      timer.current = setInterval(async () => {
        const liveCurrentAndRecent = [currentEpoch, currentEpoch - 1, currentEpoch - 2]

        dispatch(fetchRounds(liveCurrentAndRecent))
        dispatch(fetchMarketData())

        if (account) {
          const epochRange = range(earliestEpoch, currentEpoch + 1)
          dispatch(fetchLedgerData({ account, epochs: epochRange }))
          dispatch(fetchClaimableStatuses({ account, epochs: epochRange }))
        }
      }, POLL_TIME_IN_SECONDS * 1000)
    }

    return () => {
      if (timer.current) {
        clearInterval(timer.current)
      }
    }
  }, [timer, account, status, currentEpoch, earliestEpoch, dispatch])
}

export default usePollPredictions
