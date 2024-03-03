import { Currency, CurrencyAmount, Token } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useTokenContract } from './useContract'

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
