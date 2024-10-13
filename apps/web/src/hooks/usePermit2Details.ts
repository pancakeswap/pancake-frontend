import { Permit2ABI, getPermit2Address } from '@pancakeswap/permit2-sdk'
import { CurrencyAmount, Token } from '@pancakeswap/swap-sdk-core'
import { useQuery } from '@tanstack/react-query'
import { FAST_INTERVAL } from 'config/constants'
import { useCallback, useMemo } from 'react'
import { publicClient } from 'utils/wagmi'
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
) => {
  const { chainId } = useActiveChainId()
  const inputs = useMemo<[Address, Address, Address]>(
    () => [owner ?? zeroAddress, token?.address ?? zeroAddress, spender ?? zeroAddress],
    [owner, spender, token?.address],
  )

  const placeholderData = useMemo(() => {
    return [0n, 0, 0] as const
  }, [])

  return useQuery({
    queryKey: ['/token-permit/', chainId, token?.address, owner, spender],
    queryFn: async () => {
      const permit2Address = getPermit2Address(chainId)
      if (!permit2Address) {
        throw new Error(`Permit2 Contract not deployed on chain ${chainId}`)
      }
      return publicClient({ chainId }).readContract({
        abi: Permit2ABI,
        address: permit2Address,
        functionName: 'allowance',
        args: inputs,
      })
    },
    placeholderData,
    refetchInterval: FAST_INTERVAL,
    retry: true,
    refetchOnWindowFocus: false,
    enabled: Boolean(chainId && token && !token.isNative && spender && owner),
    select: useCallback(
      (data: readonly [bigint, number, number]): Permit2Details | undefined => {
        if (!data || token?.isNative) return undefined
        const [amount, expiration, nonce] = data
        return {
          amount: CurrencyAmount.fromRawAmount(token!, amount),
          expiration: Number(expiration),
          nonce: Number(nonce),
        }
      },
      [token],
    ),
  })
}
