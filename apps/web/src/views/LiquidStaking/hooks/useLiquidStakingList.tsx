import { useActiveChainId } from 'hooks/useActiveChainId'
import { LiquidStakingList } from 'views/LiquidStaking/constants/types'
import { useQuery } from '@tanstack/react-query'

interface UseLiquidStakingList {
  data: LiquidStakingList[]
  isFetching: boolean
}

export const fetchLiquidStaking = async (chainId: number) => {
  return (await import(`../constants/${chainId}.ts`)).default
}

export const useLiquidStakingList = (): UseLiquidStakingList => {
  const { chainId } = useActiveChainId()

  const { data, isLoading } = useQuery(
    ['liquidStaking', 'liquidStaking-list', chainId],
    async () => {
      try {
        return fetchLiquidStaking(chainId)
      } catch (error) {
        console.error('Cannot get liquid staking list', error, chainId)
        return []
      }
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  )

  return {
    data,
    isFetching: isLoading,
  }
}
