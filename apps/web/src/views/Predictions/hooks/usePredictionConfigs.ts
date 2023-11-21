import { useQuery } from '@tanstack/react-query'
import { getPredictionConfig } from '@pancakeswap/prediction'

import { useActiveChainId } from 'hooks/useActiveChainId'

export function usePredictionConfigs() {
  const { chainId } = useActiveChainId()
  const { data } = useQuery([chainId, 'prediction-configs'], () => getPredictionConfig(chainId))
  return data
}
