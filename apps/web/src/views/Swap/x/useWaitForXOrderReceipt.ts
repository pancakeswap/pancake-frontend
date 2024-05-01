import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { viemClientsPublicNodes } from 'hooks/usePublicNodeWaitForTransaction'
import { logger } from 'utils/datadog'
import type { Hash, TransactionReceipt } from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import { createQueryKey, UseQueryParameters } from 'views/BuyCrypto/types'
import { GetXOrderReceiptResponse, waitForXOrderReceipt } from './api'

const getXOrderReceiptQueryKey = createQueryKey<'x-receipt', [chainId: number, hash: Hash]>('x-receipt')

export type GetXOrderReceiptQueryKey = ReturnType<typeof getXOrderReceiptQueryKey>

export type GetXOrderReceiptReturnType = GetXOrderReceiptResponse['order'] & {
  receipt?: TransactionReceipt
}

type UseWaitFoXOrderReceiptParameters<selectData = GetXOrderReceiptReturnType> = Partial<{
  chainId: number
  hash: Hash
}> &
  UseQueryParameters<GetXOrderReceiptReturnType, Error, selectData, GetXOrderReceiptQueryKey>

type UseWaitForXOrderReceiptReturnType<selectData = GetXOrderReceiptReturnType> = UseQueryResult<selectData, Error>

export function useWaitForXOrderReceipt<selectData = GetXOrderReceiptReturnType>(
  parameters: UseWaitFoXOrderReceiptParameters<selectData> = {},
): UseWaitForXOrderReceiptReturnType<selectData> {
  const { chainId, enabled = true, hash, ...query } = parameters

  return useQuery({
    ...query,
    gcTime: 0,
    staleTime: 5_000 * 60, // 5 mins
    retry: 5,
    queryKey: getXOrderReceiptQueryKey([chainId!, hash!]),
    queryFn: async () => {
      if (!chainId || !hash) {
        throw new Error('No chainId or hash provided')
      }

      let tx: TransactionReceipt | undefined

      try {
        const result = await waitForXOrderReceipt({
          chainId,
          hash,
        })

        if (result.transactionHash) {
          const client = viemClientsPublicNodes[chainId as keyof typeof viemClientsPublicNodes]
          if (!client) {
            throw new Error('No client found')
          }

          tx = await waitForTransactionReceipt(client, {
            hash: result.transactionHash,
            pollingInterval: 3_000,
          })
        }

        return {
          ...result,
          receipt: tx
            ? {
                blockHash: tx.blockHash,
                blockNumber: tx.blockNumber,
                transactionHash: tx.transactionHash,
                status: tx.status,
                contractAddress: tx.contractAddress,
                from: tx.from,
                to: tx.to,
                cumulativeGasUsed: tx.cumulativeGasUsed,
                effectiveGasPrice: tx.effectiveGasPrice,
                gasUsed: tx.gasUsed,
                logs: tx.logs,
                logsBloom: tx.logsBloom,
                type: tx.type,
                transactionIndex: tx.transactionIndex,
              }
            : undefined,
        }
      } catch (error) {
        logger.error('useWaitForUserOperationReceipt', {
          error,
        })
        throw error
      }
    },
    enabled: enabled && Boolean(chainId && hash),
  })
}
