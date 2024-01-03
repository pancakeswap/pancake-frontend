import { getPredictionConfig } from '@pancakeswap/prediction'
import { useQuery } from '@tanstack/react-query'

import { ChainId } from '@pancakeswap/chains'
import { useActiveChainId } from 'hooks/useActiveChainId'

export function usePredictionConfigs(pickedChainId?: ChainId) {
  const { chainId } = useActiveChainId()
  const { data } = useQuery(
    [chainId, pickedChainId, 'prediction-configs'],
    () => getPredictionConfig(pickedChainId || chainId),
    {
      enabled: Boolean(chainId),
    },
  )
  return data
}
