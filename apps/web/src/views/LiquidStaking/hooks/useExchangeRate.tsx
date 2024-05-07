import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { publicClient } from 'utils/wagmi'
import { useLiquidStakingList } from 'views/LiquidStaking/hooks/useLiquidStakingList'

interface UseExchangeRateProps {
  decimals?: number
}

interface UseExchangeRateDetail {
  exchangeRate: string
  contract: string
  stakingSymbol: string
}

interface UseExchangeRateType {
  exchangeRateList: UseExchangeRateDetail[]
  isFetching: boolean
  refresh: () => void
}

export const useExchangeRate = ({ decimals }: UseExchangeRateProps): UseExchangeRateType => {
  const { chainId } = useActiveChainId()
  const { data: liquidStakingList } = useLiquidStakingList()

  const { data, isPending, refetch } = useQuery({
    queryKey: ['liquidStaking', 'user-exchange-rate', chainId, decimals],

    queryFn: async () => {
      try {
        const client = publicClient({ chainId })

        const result = await Promise.all(
          liquidStakingList.map(async (i) => {
            let rate = '0'
            const calls = i.exchangeRateMultiCall

            if (calls.length > 0) {
              const [exchangeRate] = await client.multicall({
                contracts: calls,
                allowFailure: false,
              })

              const rateNumber: BigNumber | undefined = exchangeRate
                ? getBalanceAmount(new BigNumber(exchangeRate?.toString()), decimals)
                : BIG_ZERO
              rate = rateNumber?.toString() ?? '0'
            }

            return {
              exchangeRate: rate,
              contract: i.contract,
              stakingSymbol: i.stakingSymbol,
            }
          }),
        )

        return result as UseExchangeRateDetail[]
      } catch (error) {
        console.error('Cannot get liquid staking exchange rate: ', error)
        return []
      }
    },

    enabled: Boolean(liquidStakingList?.length && decimals),
  })

  return {
    isFetching: isPending,
    exchangeRateList: data ?? [],
    refresh: refetch,
  }
}
