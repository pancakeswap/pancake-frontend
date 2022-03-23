import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { useGetPredictionsStatus } from 'state/predictions/hooks'
import { fetchPredictionData } from 'state/predictions'
import { PredictionStatus } from 'state/types'
import useSWR from 'swr'
import { batch } from 'react-redux'

const POLL_TIME_IN_SECONDS = 10

const usePollPredictions = () => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const status = useGetPredictionsStatus()

  useSWR(
    status !== PredictionStatus.INITIAL ? ['predictions', account] : null,
    () => {
      batch(() => {
        dispatch(fetchPredictionData(account))
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
