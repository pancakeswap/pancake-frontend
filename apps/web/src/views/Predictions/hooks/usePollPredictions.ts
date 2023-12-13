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
  const { address: predictionsAddress } = useConfig()

  useQuery(['predictions', account, predictionsAddress], () => dispatch(fetchPredictionData(account)), {
    enabled: initialBlock > 0,
    refetchInterval: POLL_TIME_IN_SECONDS * 1000,
    refetchIntervalInBackground: true,
  })
}

export default usePollPredictions
