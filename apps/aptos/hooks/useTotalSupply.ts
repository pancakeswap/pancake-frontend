import { Currency, CurrencyAmount, Token } from '@pancakeswap/aptos-swap-sdk'
import { useCoin } from '@pancakeswap/awgmi'

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export function useTotalSupply(token?: Currency): CurrencyAmount<Token> | undefined {
  const { data } = useCoin({
    coin: token?.wrapped.address,
    staleTime: Infinity,
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
