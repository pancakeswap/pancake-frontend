import { useQuery } from '@tanstack/react-query'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useLiquidStakingList } from 'views/LiquidStaking/hooks/useLiquidStakingList'

interface UseLiquidStakingAprDetail {
  apr: number
  contract: `0x${string}`
  stakingSymbol: string
}

interface UseLiquidStakingAprType {
  aprs: UseLiquidStakingAprDetail[]
  isFetching: boolean
  refresh: () => void
}

export const useLiquidStakingApr = (): UseLiquidStakingAprType => {
  const { chainId } = useActiveChainId()
  const { data: liquidStakingList } = useLiquidStakingList()

  const { data, isPending, refetch } = useQuery({
    queryKey: ['liquidStaking', 'liquid-staking-apr', chainId],

    queryFn: async () => {
      const result = await Promise.allSettled(
        liquidStakingList.map(async (i) => {
          let apr: number | null = null
          const { data: responseData } = await fetch(i.aprUrl).then((res) => res.json())

          if (responseData?.annualInterestRate) {
            apr = responseData.annualInterestRate * 100
          } else if (responseData?.apr) {
            apr = responseData.apr * 100
          }

          if (!apr) {
            throw new Error('Unknown apr')
          }

          return {
            apr,
            contract: i.contract,
            stakingSymbol: i.stakingSymbol,
          }
        }),
      )

      const results = result
        .filter((res): res is PromiseFulfilledResult<UseLiquidStakingAprDetail> => res.status === 'fulfilled')
        .map((res) => res.value)
      return results
    },

    enabled: Boolean(liquidStakingList?.length),
  })

  return {
    isFetching: isPending,
    aprs: data ?? [],
    refresh: refetch,
  }
}
