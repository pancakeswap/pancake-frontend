import { ChainId, AVERAGE_CHAIN_BLOCK_TIMES } from '@pancakeswap/chains'
import { BSC_BLOCK_TIME } from 'config'
import { CHAINS } from 'config/chains'
import first from 'lodash/first'
import { useCallback } from 'react'
import { RetryableError, retry } from 'state/multicall/retry'
import {
  BlockNotFoundError,
  GetTransactionReceiptParameters,
  PublicClient,
  TransactionNotFoundError,
  TransactionReceipt,
  TransactionReceiptNotFoundError,
  WaitForTransactionReceiptTimeoutError,
  createPublicClient,
  http,
} from 'viem'
import { usePublicClient } from 'wagmi'
import { useFetchBlockData } from '@pancakeswap/wagmi'
import { useActiveChainId } from './useActiveChainId'

export const viemClientsPublicNodes = CHAINS.reduce((prev, cur) => {
  return {
    ...prev,
    [cur.id]: createPublicClient({
      chain: cur,
      transport: http(first(cur.rpcUrls.default.http), {
        timeout: 15_000,
      }),
      batch: {
        multicall: {
          batchSize: 1024 * 200,
          wait: 16,
        },
      },
      pollingInterval: 6_000,
    }),
  }
}, {} as Record<ChainId, PublicClient>)

export type PublicNodeWaitForTransactionParams = GetTransactionReceiptParameters & {
  chainId?: number
}

export function usePublicNodeWaitForTransaction() {
  const { chainId } = useActiveChainId()
  const provider = usePublicClient({ chainId })
  const refetchBlockData = useFetchBlockData(chainId)

  const waitForTransaction_ = useCallback(
    async (opts: PublicNodeWaitForTransactionParams): Promise<TransactionReceipt> => {
      const getTransaction = async () => {
        try {
          const selectedChain: ChainId = opts?.chainId ?? chainId
          // our custom node might be late to sync up
          if (selectedChain && viemClientsPublicNodes[selectedChain]) {
            const receipt = await viemClientsPublicNodes[selectedChain].getTransactionReceipt({ hash: opts.hash })
            if (receipt.status === 'success') {
              refetchBlockData()
            }
          }

          if (!provider) return undefined

          const receipt = await provider.getTransactionReceipt({ hash: opts.hash })
          if (receipt.status === 'success') {
            refetchBlockData()
          }
          return receipt
        } catch (error) {
          if (error instanceof TransactionNotFoundError) {
            throw new RetryableError(`Transaction not found: ${opts.hash}`)
          } else if (error instanceof TransactionReceiptNotFoundError) {
            throw new RetryableError(`Transaction receipt not found: ${opts.hash}`)
          } else if (error instanceof BlockNotFoundError) {
            throw new RetryableError(`Block not found for transaction: ${opts.hash}`)
          } else if (error instanceof WaitForTransactionReceiptTimeoutError) {
            throw new RetryableError(`Timeout reached when fetching transaction receipt: ${opts.hash}`)
          }
          throw error
        }
      }
      return retry(getTransaction, {
        n: 10,
        minWait: 5000,
        maxWait: 10000,
        delay: (chainId ? AVERAGE_CHAIN_BLOCK_TIMES[chainId as ChainId] : BSC_BLOCK_TIME) * 1000 + 1000,
      }).promise as Promise<TransactionReceipt>
    },
    [chainId, provider, refetchBlockData],
  )

  return {
    waitForTransaction: waitForTransaction_,
  }
}
