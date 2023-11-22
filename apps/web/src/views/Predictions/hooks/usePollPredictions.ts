import { useAccount } from 'wagmi'
import { fetchPredictionData } from 'state/predictions'
import { useInitialBlock } from 'state/block/hooks'
import { useQuery } from '@tanstack/react-query'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { useConfig } from '../context/ConfigProvider'

const POLL_TIME_IN_SECONDS = 10

const usePollPredictions = () => {
  const dispatch = useLocalDispatch()
  const { address: account } = useAccount()
  const initialBlock = useInitialBlock()
  const config = useConfig()
  const predictionsAddress = config?.address

  useQuery(
    ['predictions', account, predictionsAddress],
    () => {
      dispatch(fetchPredictionData(account))
    },
    {
      enabled: Boolean(initialBlock > 0 && config?.address),
      refetchInterval: POLL_TIME_IN_SECONDS * 1000,
      refetchIntervalInBackground: true,
    },
  )
}

export default usePollPredictions
