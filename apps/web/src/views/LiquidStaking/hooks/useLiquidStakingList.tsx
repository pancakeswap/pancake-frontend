import useSWR from 'swr'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { LiquidStakingList } from 'views/LiquidStaking/constants/types'

export const useLiquidStakingList = (): LiquidStakingList[] => {
  const { chainId } = useActiveChainId()

  const { data } = useSWR(
    ['/liquidStaking-list', chainId],
    async () => {
      try {
        return (await import(`../constants/${chainId}.ts`)).default
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

  return data
}
