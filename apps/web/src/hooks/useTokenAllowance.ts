import { Token, CurrencyAmount } from '@pancakeswap/sdk'
import { useContractRead } from 'wagmi'
import { useMemo } from 'react'

import { useTokenContract } from './useContract'

function useTokenAllowance(
  token?: Token,
  owner?: string,
  spender?: string,
): {
  allowance: CurrencyAmount<Token> | undefined
  refetch: () => Promise<any>
} {
  const contract = useTokenContract(token?.address)

  const inputs = useMemo(() => [owner, spender] as [`0x${string}`, `0x${string}`], [owner, spender])

  const { data: allowance, refetch } = useContractRead({
    ...contract,
    functionName: 'allowance',
    args: inputs,
    enabled: Boolean(spender && owner),
    watch: true,
  })

  return useMemo(
    () => ({
      allowance:
        token && typeof allowance !== 'undefined'
          ? CurrencyAmount.fromRawAmount(token, allowance.toString())
          : undefined,
      refetch,
    }),
    [token, refetch, allowance],
  )
}

export default useTokenAllowance
