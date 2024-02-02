import { Permit2ABI, getPermit2Address } from '@pancakeswap/permit2-sdk'
import { CurrencyAmount, Token } from '@pancakeswap/swap-sdk-core'
import { useQuery } from '@tanstack/react-query'
import { FAST_INTERVAL } from 'config/constants'
import { useMemo } from 'react'
import { publicClient } from 'utils/client'
import { Address, zeroAddress } from 'viem'
import { useActiveChainId } from './useActiveChainId'

export type Permit2Details = {
  // the maximum amount allowed to spend
  amount: CurrencyAmount<Token> | undefined
  // timestamp at which a spender's token allowances become invalid
  expiration: number
  // an incrementing value indexed per owner,token,and spender for each signature
  nonce: number
}

export const usePermit2Details = (
  owner: Address | undefined,
  token: Token | undefined,
  spender: Address | undefined,
): Permit2Details => {
  const { chainId } = useActiveChainId()
  const inputs = useMemo<[Address, Address, Address]>(
    () => [owner ?? zeroAddress, token?.address ?? zeroAddress, spender ?? zeroAddress],
    [owner, spender, token?.address],
  )

  const defaultPermit = useMemo(() => {
    return {
      amount: token ? CurrencyAmount.fromRawAmount(token, '0') : undefined,
      expiration: 0,
      nonce: 0,
    }
  }, [token])

  const { data: permit } = useQuery({
    queryKey: ['/token-permit/', chainId, token?.address, owner, spender],
    queryFn: async () =>
      publicClient({ chainId }).readContract({
        abi: Permit2ABI,
        address: getPermit2Address(chainId),
        functionName: 'allowance',
        args: inputs,
      }),
    refetchInterval: FAST_INTERVAL,
    retry: true,
    refetchOnWindowFocus: false,
    enabled: Boolean(chainId && token && !token.isNative && spender && owner),
    select: (data) => {
      if (!data || token?.isNative) return undefined
      const [amount, expiration, nonce] = data
      return {
        amount: CurrencyAmount.fromRawAmount(token!, amount),
        expiration: Number(expiration),
        nonce: Number(nonce),
      }
    },
  })

  return permit ?? defaultPermit
}
