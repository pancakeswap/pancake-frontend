import { useAccount } from 'wagmi'
import { fetchPredictionData } from 'state/predictions'
import { useInitialBlock } from 'state/block/hooks'
import { useQuery } from '@tanstack/react-query'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { useConfig } from '../context/ConfigProvider'

const POLL_TIME_IN_SECONDS = 10

const usePollPredictions = () => {
  const dispatch = useLocalDispatch()
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const initialBlock = useInitialBlock()
  const config = useConfig()
  const predictionsAddress = config?.address

  useQuery({
    queryKey: ['predictions', account, chainId, predictionsAddress],
    queryFn: () => chainId && dispatch(fetchPredictionData({ account, chainId })),
    enabled: Boolean(initialBlock > 0 && predictionsAddress && chainId),
    refetchInterval: POLL_TIME_IN_SECONDS * 1000,
    refetchIntervalInBackground: true,
  })
}

export default usePollPredictions
