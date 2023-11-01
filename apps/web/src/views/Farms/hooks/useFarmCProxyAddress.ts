import { ChainId } from '@pancakeswap/chains'
import { fetchCProxyAddress } from 'state/farms/fetchFarmUser'
import { farmFetcher } from 'state/farms'
import { Address } from 'wagmi'
import { useQuery } from '@tanstack/react-query'

export const useFarmCProxyAddress = (account?: string, chainId?: number) => {
  const multiCallChainId = farmFetcher.isTestnet(chainId) ? ChainId.BSC_TESTNET : ChainId.BSC
  const { data } = useQuery(
    ['cProxyAddress', account, chainId],
    async () => fetchCProxyAddress(account as Address, multiCallChainId),
    {
      enabled: Boolean(account && chainId),
    },
  )

  return {
    cProxyAddress: data,
  }
}
