import { CurrencyAmount } from '@pancakeswap/sdk'
import { useDeferredValue } from 'react'
import useSWR from 'swr'

export function useEstimatedAmount({ estimatedCurrency, stableSwapConfig, quotient, stableSwapContract }) {
  const deferQuotient = useDeferredValue(quotient)

  return useSWR(
    stableSwapConfig?.stableSwapAddress && estimatedCurrency && !!deferQuotient
      ? ['swapContract', stableSwapConfig?.stableSwapAddress, deferQuotient]
      : null,
    async () => {
      const isToken0 = stableSwapConfig?.token0?.address === estimatedCurrency?.address

      const args = isToken0 ? [1, 0, deferQuotient] : [0, 1, deferQuotient]

      const estimatedAmount = await stableSwapContract.get_dy(...args)

      return CurrencyAmount.fromRawAmount(estimatedCurrency, estimatedAmount)
    },
    {
      keepPreviousData: true,
    },
  )
}
