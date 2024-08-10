import { ChainId, AVERAGE_CHAIN_BLOCK_TIMES } from '@pancakeswap/chains'
import { useCallback, useMemo } from 'react'
import { RetryableError, retry } from 'state/multicall/retry'
import { Hash } from 'viem'
import { useAccount } from 'wagmi'

enum TransactionStatus {
  AWAITING_CONFIRMATIONS = 'AWAITING_CONFIRMATIONS',
  AWAITING_EXECUTION = 'AWAITING_EXECUTION',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
}

type TransactionDetails = {
  txStatus: TransactionStatus
  txHash?: string
}

class SafeTxHashNotAvailableError extends Error {
  constructor() {
    super('Safe transaction hash is not available')
  }
}

export const useSafeTxHashTransformer = () => {
  const { connector, chainId } = useAccount()
  const isGnosisSafe = useMemo(() => connector?.name === 'Safe', [connector])
  const confirmationSeconds = chainId ? AVERAGE_CHAIN_BLOCK_TIMES[chainId] : AVERAGE_CHAIN_BLOCK_TIMES[ChainId.BSC]

  return useCallback(
    async <T = Hash | TransactionDetails>(safeTxHash: T): Promise<Hash> => {
      if (!isGnosisSafe) return safeTxHash as Hash
      const hash = safeTxHash as Hash

      try {
        if (!hash) {
          return safeTxHash as Hash
        }

        const getTxHash = async (): Promise<Hash> => {
          try {
            const provider: any = await connector!.getProvider()
            const resp = (await provider.sdk.txs.getBySafeTxHash(hash)) as TransactionDetails

            if (
              resp.txStatus === TransactionStatus.AWAITING_CONFIRMATIONS ||
              resp.txStatus === TransactionStatus.AWAITING_EXECUTION
            ) {
              throw new SafeTxHashNotAvailableError()
            }

            if (resp.txHash) return resp.txHash as Hash

            return (resp.txHash as Hash) ?? hash
          } catch (error) {
            console.error('Failed to get transaction hash from Safe SDK', error)
            if (error instanceof SafeTxHashNotAvailableError) {
              throw new RetryableError(error.message)
            }
            throw error
          }
        }

        return retry(getTxHash, {
          n: 10,
          minWait: 5000,
          maxWait: 10000,
          delay: confirmationSeconds * 1000 + 1000,
        }).promise as Promise<Hash>
      } catch (error) {
        console.error('Failed to get transaction hash from Safe SDK', error)
      }

      return safeTxHash as Hash
    },
    [confirmationSeconds, connector, isGnosisSafe],
  )
}
