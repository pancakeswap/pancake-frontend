import { ChainId } from '@pancakeswap/chains'
import {
  DetailedExecutionInfoType,
  TransactionStatus,
  type MultisigExecutionDetails,
  type TransactionDetails,
} from '@safe-global/safe-gateway-typescript-sdk'
import { AVERAGE_CHAIN_BLOCK_TIMES } from 'config/constants/averageChainBlockTimes'
import { useCallback, useMemo } from 'react'
import { RetryableError, retry } from 'state/multicall/retry'
import { Hash } from 'viem'
import { useAccount } from 'wagmi'

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
      console.debug('debug call useSafeTxHashTransformer', safeTxHash)
      if (!isGnosisSafe) return safeTxHash as Hash
      let hash = safeTxHash as Hash

      try {
        if (typeof safeTxHash !== 'string') {
          console.debug('debug safeTxHash is resp', safeTxHash)
          const detailedExecutionInfo = (safeTxHash as TransactionDetails)
            ?.detailedExecutionInfo as MultisigExecutionDetails

          // eslint-disable-next-line no-param-reassign
          hash = detailedExecutionInfo?.safeTxHash as Hash
        }

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

            if (
              resp.detailedExecutionInfo &&
              resp.detailedExecutionInfo.type === DetailedExecutionInfoType.MULTISIG &&
              resp.detailedExecutionInfo.safeTxHash
            ) {
              console.debug('debug detailedExecutionInfo', resp.detailedExecutionInfo)
              return resp.detailedExecutionInfo.safeTxHash as Hash
            }

            console.debug('debug txStatus', resp.txStatus)
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
