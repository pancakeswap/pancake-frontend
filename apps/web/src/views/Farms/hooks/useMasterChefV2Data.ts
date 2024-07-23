import { masterChefAddresses } from '@pancakeswap/farms/src/const'
import { fetchMasterChefV2Data } from '@pancakeswap/farms/src/v2/fetchFarmsV2'
import { useQuery } from '@tanstack/react-query'
import { publicClient } from 'utils/viem'

const fetcher = (chainId?: number) => {
  if (!chainId) return Promise.resolve(null)

  const masterChefAddress = masterChefAddresses[chainId]

  return fetchMasterChefV2Data({
    isTestnet: false,
    provider: publicClient,
    masterChefAddress,
  })
}
export const useMasterChefV2Data = (chainId?: number) => {
  return useQuery({
    queryKey: ['masterChefV2Data', chainId],
    queryFn: () => fetcher(chainId),
    enabled: !!chainId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}
