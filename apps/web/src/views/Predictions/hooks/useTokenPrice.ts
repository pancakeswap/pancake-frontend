import { Currency } from '@pancakeswap/swap-sdk-core'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import useSWRImmutable from 'swr/immutable'
import { fetchTokenUSDValue } from 'utils/llamaPrice'

export const useTokenPrice = (token: Currency | undefined, enabled = true): BigNumber => {
  const { data: tokenPrice } = useSWRImmutable<string | undefined>(
    token && enabled && ['fiat-price-llama', token],
    async () => {
      if (!token) {
        return undefined
      }
      const tokenAddress = token.wrapped.address
      const result = await fetchTokenUSDValue(token.chainId, [tokenAddress])
      return result.get(tokenAddress)
    },
    {
      dedupingInterval: 30_000,
      refreshInterval: 30_000,
    },
  )

  return tokenPrice ? new BigNumber(tokenPrice) : BIG_ZERO
}
