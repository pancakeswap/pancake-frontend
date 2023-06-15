import { ChainId } from '@gelatonetwork/limit-orders-lib'
import { CHAINS } from 'config/chains'
import { TransactionReceipt, createPublicClient, http, PublicClient } from 'viem'
import { useCallback } from 'react'
import { WaitForTransactionArgs, waitForTransaction } from 'wagmi/actions'
import { useActiveChainId } from './useActiveChainId'

const viemClientsPublicNodes = CHAINS.reduce((prev, cur) => {
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
        },
      },
    }),
  }
}, {} as Record<ChainId, PublicClient>)

export function usePublicNodeWaitForTransaction() {
  const { chainId } = useActiveChainId()

  const waitForTransaction_ = useCallback(
    async (opts: WaitForTransactionArgs): Promise<TransactionReceipt> => {
      // our custom node might be late to sync up
      if (viemClientsPublicNodes[chainId]) {
        return viemClientsPublicNodes[chainId].waitForTransactionReceipt(opts)
      }
      return waitForTransaction({ ...opts, chainId })
    },
    [chainId],
  )

  return {
    waitForTransaction: waitForTransaction_,
  }
}
