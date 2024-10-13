import { bCakeSupportedChainId } from '@pancakeswap/farms'
import { useQuery } from '@tanstack/react-query'
import { NO_PROXY_CONTRACT } from 'config/constants'
import { useBCakeFarmBoosterContract } from 'hooks/useContract'
import { Address } from 'viem'

export const useBCakeProxyContractAddress = (account?: Address, chainId?: number) => {
  const bCakeFarmBoosterContract = useBCakeFarmBoosterContract()
  const isSupportedChain = chainId ? bCakeSupportedChainId.includes(chainId) : false
  const { data, status, refetch } = useQuery({
    queryKey: ['bProxyAddress', account, chainId],
    queryFn: async () => bCakeFarmBoosterContract.read.proxyContract([account!]),
    enabled: Boolean(account && isSupportedChain),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
  const isLoading = isSupportedChain ? status !== 'success' : false

  return {
    proxyAddress: data as Address | undefined,
    isLoading,
    proxyCreated: data && data !== NO_PROXY_CONTRACT,
    refreshProxyAddress: refetch,
  }
}
