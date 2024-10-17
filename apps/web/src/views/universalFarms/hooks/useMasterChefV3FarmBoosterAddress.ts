import { useQuery } from '@tanstack/react-query'
import { getMasterChefV3Contract } from 'utils/contractHelpers'

export const useMasterChefV3FarmBoosterAddress = (chainId: number) => {
  const masterChefV3 = getMasterChefV3Contract(undefined, chainId)
  return useQuery({
    queryKey: ['masterChefV3', 'farmBooster', chainId],
    queryFn: async () => {
      if (!masterChefV3) return 0
      return masterChefV3.read.FARM_BOOSTER()
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  })
}
