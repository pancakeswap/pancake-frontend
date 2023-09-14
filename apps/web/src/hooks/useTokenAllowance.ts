import { Token, CurrencyAmount } from '@pancakeswap/sdk'
import { erc20ABI } from 'wagmi'
import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { publicClient } from 'utils/wagmi'
import { FAST_INTERVAL } from 'config/constants'
import { useCallback } from 'react'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { TransactionType } from 'state/info/types'
import { useTokenContract } from './useContract'
import useAccountActiveChain from './useAccountActiveChain'
import { isUserRejected } from 'utils/sentry'
import { TransactionRejectedError } from 'views/Swap/V3Swap/hooks/useSendSwapTransaction'
import { Info } from 'state/transactions/hooks'

interface BaseTransactionInfo {
  type: TransactionType
}

export interface ApproveTransactionInfo extends BaseTransactionInfo {
  tokenAddress: string
  spender: string
  amount: string
}

function useTokenAllowance(
  token?: Token,
  owner?: string,
  spender?: string,
): {
  allowance: CurrencyAmount<Token> | undefined
  refetch: () => Promise<any>
} {
  const { chainId } = useActiveChainId()

  const inputs = useMemo(() => [owner, spender] as [`0x${string}`, `0x${string}`], [owner, spender])

  const { data: allowance, refetch } = useQuery(
    [chainId, token?.address, owner, spender],
    () =>
      publicClient({ chainId }).readContract({
        abi: erc20ABI,
        address: token?.address,
        functionName: 'allowance',
        args: inputs,
      }),
    {
      refetchInterval: FAST_INTERVAL,
      retry: true,
      refetchOnWindowFocus: false,
      enabled: Boolean(spender && owner),
    },
  )

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

export function useUpdateTokenAllowance(
  amount: CurrencyAmount<Token> | undefined,
  spender: string
): () => Promise<{ response: any; info: Info }> {
  const contract = useTokenContract(amount?.currency.address)
  const { account, chainId: chain } = useAccountActiveChain()

  return useCallback(async () => {
    try {
      if (!amount) throw new Error('missing amount')
      if (!contract) throw new Error('missing contract')
      if (!spender) throw new Error('missing spender')

      const allowance = amount.equalTo(0) ? '0' : MaxUint256.toString()
      const response = contract.write.approve([spender as `0x${string}`, allowance], {
        account,
        chain,
      })
      return {
        response,
        info:{
          summary: `Approve ${allowance}`,
          translatableSummary: {
            text: 'Approve %symbol%',
            data: { symbol: '' },
          },
          approval: { tokenAddress: contract.address, spender },
          type: 'approve',
        },
      }
    } catch (e: unknown) {
      const symbol = amount?.currency.symbol ?? 'Token'
      if (isUserRejected(e)) {
        throw new TransactionRejectedError(`${symbol} token allowance failed: User rejected`)
      }
      throw new Error(`${symbol} token allowance failed: ${e instanceof Error ? e.message : e}`)
    }
  }, [amount, contract, spender])
}

export function useRevokeTokenAllowance(
  token: Token | undefined,
  spender: string
): () => Promise<{ response: any; info: Info }> {
  const amount = useMemo(() => (token ? CurrencyAmount.fromRawAmount(token, 0) : undefined), [token])

  return useUpdateTokenAllowance(amount, spender)
}

export default useTokenAllowance
