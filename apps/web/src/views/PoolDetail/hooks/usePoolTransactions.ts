import { Protocol } from '@pancakeswap/farms'
import { zeroAddress } from '@pancakeswap/price-api-sdk'
import { Token } from '@pancakeswap/swap-sdk-core'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { chainIdToExplorerInfoChainName, explorerApiClient } from 'state/info/api/client'
import { components } from 'state/info/api/schema'
import { Address, Hash } from 'viem'
import { useCallback } from 'react'
import { Transaction, TransactionType } from '../components/Transactions/type'

const urlMap = {
  [Protocol.V3]: '/cached/tx/v3/{chainName}/recent' as const,
  [Protocol.V4BIN]: '/cached/tx/v4/{chainName}/recent' as const,
  [Protocol.STABLE]: '/cached/tx/stable/{chainName}/recent' as const,
  [Protocol.V2]: '/cached/tx/v2/{chainName}/recent' as const,
} as const

const typeMap = {
  mint: TransactionType.Add,
  burn: TransactionType.Remove,
  swap: TransactionType.Swap,
} as const

export const fetchPoolTransactions = async (
  address: string,
  protocol: Protocol,
  chainName: components['schemas']['ChainName'],
  chainId: number,
  signal?: AbortSignal,
): Promise<Transaction[]> => {
  const url = urlMap[protocol]
  const resp = await explorerApiClient.GET(url, {
    signal,
    params: {
      path: {
        chainName,
      },
      query: {
        pool: address,
      },
    },
  })
  if (!resp.data) {
    return []
  }

  const result = resp.data.map((m) => ({
    id: m.id,
    type: typeMap[m.type],
    sender: (m.origin as Address) ?? zeroAddress,
    transactionHash: m.transactionHash as Hash,
    poolId: m.poolId as Address,
    token0: new Token(chainId, m.token0.id as Address, m.token0.decimals, m.token0.symbol),
    token1: new Token(chainId, m.token1.id as Address, m.token1.decimals, m.token1.symbol),
    amountUSD: parseFloat(m.amountUSD),
    amount0: parseFloat(m.amount0),
    amount1: parseFloat(m.amount1),
    timestamp: dayjs(m.timestamp as string).unix(),
  }))
  return result
}

export const usePoolTransactions = (address?: string, protocol?: Protocol, chainId?: number) => {
  const chainName = chainId ? chainIdToExplorerInfoChainName[chainId] : undefined
  return useQuery({
    queryKey: ['poolTransactions', chainName, protocol, address],
    queryFn: () =>
      fetchPoolTransactions(address!, protocol!, chainName! as components['schemas']['ChainName'], chainId!),
    enabled: !!address && !!protocol && !!chainName && !!chainId,
    select: useCallback((data: Transaction[]) => data.filter((tx) => tx.amountUSD > 0), []),
  })
}
