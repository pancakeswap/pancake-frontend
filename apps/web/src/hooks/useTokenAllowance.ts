import { Token, CurrencyAmount } from '@pancakeswap/sdk'
import { useMemo } from 'react'

import { useTokenContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

function useTokenAllowance(token?: Token, owner?: string, spender?: string): CurrencyAmount<Token> | undefined {
  const contract = useTokenContract(token?.address)

  const inputs = useMemo(() => [owner, spender] as [`0x${string}`, `0x${string}`], [owner, spender])
  const allowance = useSingleCallResult({
    contract: spender && owner ? contract : null,
    functionName: 'allowance',
    args: inputs,
  }).result

  return useMemo(
    () =>
      token && typeof allowance !== 'undefined' ? CurrencyAmount.fromRawAmount(token, allowance.toString()) : undefined,
    [token, allowance],
  )
}

export default useTokenAllowance
