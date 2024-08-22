import { useQuery } from '@tanstack/react-query'
import { getUserMultiplier } from 'views/Farms/components/YieldBooster/hooks/bCakeV3/multiplierAPI'
import { useMasterChefV3FarmBoosterAddress } from './useMasterChefV3FarmBoosterAddress'

export const useUserMultiplier = (chainId: number, tokenId?: bigint) => {
  const { data: farmBoosterAddress } = useMasterChefV3FarmBoosterAddress(chainId)
  return useQuery({
    queryKey: ['userMultiplier', farmBoosterAddress, chainId, tokenId?.toString()],
    queryFn: async () => {
      return getUserMultiplier({ address: farmBoosterAddress, tokenId, chainId })
    },
    enabled: !!farmBoosterAddress && !!tokenId && !!chainId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    staleTime: Infinity,
  })
}
