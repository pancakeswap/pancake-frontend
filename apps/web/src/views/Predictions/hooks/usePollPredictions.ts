import { useAccount } from 'wagmi'
import { fetchPredictionData } from 'state/predictions'
import { useInitialBlock } from 'state/block/hooks'
import useSWR from 'swr'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { useConfig } from '../context/ConfigProvider'

const POLL_TIME_IN_SECONDS = 10

const usePollPredictions = () => {
  const dispatch = useLocalDispatch()
  const { address: account } = useAccount()
  const initialBlock = useInitialBlock()
  const { address: predictionsAddress } = useConfig()

  useSWR(
    initialBlock > 0 ? ['predictions', account, predictionsAddress] : null,
    () => dispatch(fetchPredictionData(account)),
    {
      refreshInterval: POLL_TIME_IN_SECONDS * 1000,
      refreshWhenHidden: true,
      refreshWhenOffline: true,
    },
  )
}

export default usePollPredictions
