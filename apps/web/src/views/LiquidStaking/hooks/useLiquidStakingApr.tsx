import { useQuery } from '@tanstack/react-query'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useLiquidStakingList } from 'views/LiquidStaking/hooks/useLiquidStakingList'

interface UseLiquidStakingAprDetail {
  apr: number
  contract: string
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
      try {
        const result = await Promise.all(
          liquidStakingList.map(async (i) => {
            const response = await fetch(i.aprUrl).then((res) => res.json())

            const responseData = response?.data || response

            const apr: number | null = responseData?.annualInterestRate
              ? responseData?.annualInterestRate * 100
              : responseData || null

            return {
              apr,
              contract: i.contract,
              stakingSymbol: i.stakingSymbol,
            }
          }),
        )

        return result as UseLiquidStakingAprDetail[]
      } catch (error) {
        console.error('Cannot get liquid staking apr: ', error)
        return []
      }
    },

    enabled: Boolean(liquidStakingList?.length),
  })

  return {
    isFetching: isPending,
    aprs: data ?? [],
    refresh: refetch,
  }
}
