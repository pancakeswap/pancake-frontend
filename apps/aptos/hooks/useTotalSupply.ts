import { Currency, CurrencyAmount } from '@pancakeswap/aptos-swap-sdk'
import { useCoin, useLedger } from '@pancakeswap/awgmi'
import _toNumber from 'lodash/toNumber'

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export function useTotalSupply(token?: Currency): CurrencyAmount<Currency> | undefined {
  const { data: ledgerData } = useLedger()

  const currentBlock = ledgerData?.block_height && +ledgerData.block_height

  const { data } = useCoin({
    cacheTime: _toNumber(currentBlock),
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
