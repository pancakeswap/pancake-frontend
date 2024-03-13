import { useQuery } from '@tanstack/react-query'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { LiquidStakingList } from 'views/LiquidStaking/constants/types'

interface UseLiquidStakingList {
  data: LiquidStakingList[]
  isFetching: boolean
}

export const fetchLiquidStaking = async (chainId: number) => {
  return (await import(`../constants/${chainId}.ts`)).default
}

export const useLiquidStakingList = (): UseLiquidStakingList => {
  const { chainId } = useActiveChainId()

  const { data, isPending } = useQuery({
    queryKey: ['liquidStaking', 'liquidStaking-list', chainId],

    queryFn: async () => {
      try {
        return fetchLiquidStaking(chainId!)
      } catch (error) {
        console.error('Cannot get liquid staking list', error, chainId)
        return []
      }
    },

    enabled: Boolean(chainId),

    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return {
    data,
    isFetching: isPending,
  }
}
