import { Currency, CurrencyAmount } from '@pancakeswap/aptos-swap-sdk'
import { useCoin } from '@pancakeswap/awgmi'

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export function useTotalSupply(token?: Currency): CurrencyAmount<Currency> | undefined {
  const { data } = useCoin({
    coin: token?.wrapped.address,
    staleTime: 0,
    select: (d) => {
      if (token && d.supply) {
        return CurrencyAmount.fromRawAmount(token.wrapped, d.supply)
      }
      return undefined
    },
  })

  return data
}

export default useTotalSupply
