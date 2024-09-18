import { ChainId } from '@pancakeswap/chains'
import { CrossChainMessage, getCrossChainMessage } from '@pancakeswap/ifos'
import { useQuery } from '@tanstack/react-query'
import { FAST_INTERVAL } from 'config/constants'

export type CrossChainStatus = CrossChainMessage['status']
export const useCrossChainMessage = (targetChainId?: ChainId, txHash?: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['veCake/useCrossChainMessage', targetChainId, txHash],
    queryFn: () => {
      if (!txHash || !targetChainId) throw new Error('txHash and targetChainId are required')
      return getCrossChainMessage({ chainId: targetChainId, txHash })
    },
    enabled: !!txHash,
    refetchInterval: FAST_INTERVAL,
  })
  return { data, isLoading }
}
