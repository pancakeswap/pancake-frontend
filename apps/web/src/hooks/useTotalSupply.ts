import { useMemo } from 'react'
import { Currency, CurrencyAmount, Token } from '@pancakeswap/sdk'
import { useTokenContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export function useTotalSupply(token?: Currency): CurrencyAmount<Token> | undefined {
  const contract = useTokenContract(token?.isToken ? token.address : undefined)

  const totalSupplyStr: string | undefined = useSingleCallResult({
    contract,
    functionName: 'totalSupply',
  })?.result?.toString()

  return useMemo(
    () => (token?.isToken && totalSupplyStr ? CurrencyAmount.fromRawAmount(token, totalSupplyStr) : undefined),
    [token, totalSupplyStr],
  )
}

export default useTotalSupply
