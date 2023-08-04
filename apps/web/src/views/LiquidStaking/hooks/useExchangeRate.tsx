import useSWR from 'swr'
import { useActiveChainId } from 'hooks/useActiveChainId'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { publicClient } from 'utils/wagmi'
import { useLiquidStakingList } from 'views/LiquidStaking/hooks/useLiquidStakingList'
import { FunctionName } from 'views/LiquidStaking/constants/types'

interface UseExchangeRateProps {
  decimals: number
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
  const liquidStakingList = useLiquidStakingList()

  const { data, isLoading, mutate } = useSWR(
    liquidStakingList?.length && ['/user-exchange-rate', chainId, liquidStakingList],
    async () => {
      try {
        const client = publicClient({ chainId })

        const result = await Promise.all(
          liquidStakingList.map(async (i) => {
            let rate = '0'
            const calls = i.multiCallMethods
              .filter((methods) => methods?.filterName === FunctionName.exchangeRate)
              .map((call) => ({
                abi: call.abi,
                address: call.address,
                functionName: call.functionName,
                args: call?.args ?? [],
              }))

            if (calls.length > 0) {
              const [exchangeRate] = await client.multicall({
                contracts: calls,
                allowFailure: false,
              })

              const rateNumber: BigNumber | undefined = exchangeRate
                ? new BigNumber(exchangeRate?.toString()).dividedBy(new BigNumber(10 ** decimals ?? 18))
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
  )

  return {
    isFetching: isLoading,
    exchangeRateList: data ?? [],
    refresh: mutate,
  }
}
