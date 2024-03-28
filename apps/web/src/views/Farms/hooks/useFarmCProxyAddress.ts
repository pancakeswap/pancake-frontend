import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import { farmFetcher } from 'state/farms'
import { fetchCProxyAddress } from 'state/farms/fetchFarmUser'
import { Address } from 'viem'

export const useFarmCProxyAddress = (account?: string | null, chainId?: number) => {
  const multiCallChainId = chainId && farmFetcher.isTestnet(chainId) ? ChainId.BSC_TESTNET : ChainId.BSC
  const { data } = useQuery({
    queryKey: ['cProxyAddress', account, chainId],
    queryFn: async () => fetchCProxyAddress(account as Address, multiCallChainId),
    enabled: Boolean(account && chainId),
  })

  return {
    cProxyAddress: data,
  }
}
