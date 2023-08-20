import useSWR from 'swr'
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

  const { data, isLoading } = useSWR(
    ['/liquidStaking-list', chainId],
    async () => {
      try {
        return fetchLiquidStaking(chainId)
      } catch (error) {
        console.error('Cannot get liquid staking list', error, chainId)
        return []
      }
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
    },
  )

  return {
    data,
    isFetching: isLoading,
  }
}
