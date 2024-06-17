import { ChainId } from '@pancakeswap/chains'
import { CrossChainMessage, getCrossChainMessage } from '@pancakeswap/ifos'
import { useQuery } from '@tanstack/react-query'
import { FAST_INTERVAL } from 'config/constants'

export type CrossChainStatus = CrossChainMessage['status']
export const useCrossChianMessage = (targetChainId?: ChainId, txHash?: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['crossChainMessage', targetChainId, txHash],
    queryFn: () => {
      if (!txHash || !targetChainId) throw new Error('txHash and targetChainId are required')
      return getCrossChainMessage({ chainId: targetChainId, txHash })
    },
    enabled: !!txHash && Boolean(targetChainId),
    refetchInterval: FAST_INTERVAL,
  })
  return { data, isLoading }
}
