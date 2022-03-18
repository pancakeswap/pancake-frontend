import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { useGetCurrentEpoch, useGetEarliestEpoch, useGetPredictionsStatus } from 'state/predictions/hooks'
import { fetchClaimableStatuses, fetchLedgerData, fetchMarketData, fetchRounds } from 'state/predictions'
import { PredictionStatus } from 'state/types'
import range from 'lodash/range'
import useSWR from 'swr'
import { batch } from 'react-redux'

const POLL_TIME_IN_SECONDS = 10

const usePollPredictions = () => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const currentEpoch = useGetCurrentEpoch()
  const earliestEpoch = useGetEarliestEpoch()
  const status = useGetPredictionsStatus()

  useSWR(
    status !== PredictionStatus.INITIAL && currentEpoch && earliestEpoch
      ? ['predictions', currentEpoch, earliestEpoch, account]
      : null,
    () => {
      const liveCurrentAndRecent = [currentEpoch, currentEpoch - 1, currentEpoch - 2]

      batch(() => {
        dispatch(fetchRounds(liveCurrentAndRecent))
        dispatch(fetchMarketData())
        if (account) {
          const epochRange = range(earliestEpoch, currentEpoch + 1)
          dispatch(fetchLedgerData({ account, epochs: epochRange }))
          dispatch(fetchClaimableStatuses({ account, epochs: epochRange }))
        }
      })
    },
    {
      refreshInterval: POLL_TIME_IN_SECONDS * 1000,
      refreshWhenHidden: true,
      refreshWhenOffline: true,
    },
  )
}

export default usePollPredictions
