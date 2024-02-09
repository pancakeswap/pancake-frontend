import { ChainId } from '@gelatonetwork/limit-orders-lib'
import { BSC_BLOCK_TIME } from 'config'
import { CHAINS } from 'config/chains'
import { AVERAGE_CHAIN_BLOCK_TIMES } from 'config/constants/averageChainBlockTimes'
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
import { useActiveChainId } from './useActiveChainId'

export const viemClientsPublicNodes = CHAINS.reduce((prev, cur) => {
  return {
    ...prev,
    [cur.id]: createPublicClient({
      chain: cur,
      transport: http(cur.rpcUrls.public.http[0], {
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

  const waitForTransaction_ = useCallback(
    async (opts: PublicNodeWaitForTransactionParams): Promise<TransactionReceipt> => {
      const getTransaction = async () => {
        try {
          const selectedChain = opts?.chainId ?? chainId
          // our custom node might be late to sync up
          if (selectedChain && viemClientsPublicNodes[selectedChain]) {
            return await viemClientsPublicNodes[selectedChain].getTransactionReceipt({ hash: opts.hash })
          }
          return await provider.getTransactionReceipt({ hash: opts.hash })
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
        delay: (chainId ? AVERAGE_CHAIN_BLOCK_TIMES[chainId] : BSC_BLOCK_TIME) * 1000 + 1000,
      }).promise as Promise<TransactionReceipt>
    },
    [chainId, provider],
  )

  return {
    waitForTransaction: waitForTransaction_,
  }
}
