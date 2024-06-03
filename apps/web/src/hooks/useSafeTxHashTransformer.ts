import type { MultisigExecutionDetails, TransactionDetails } from '@safe-global/safe-gateway-typescript-sdk'
import { useCallback, useMemo } from 'react'
import { Hash } from 'viem'
import { useAccount } from 'wagmi'

export const useSafeTxHashTransformer = () => {
  const { connector } = useAccount()
  const isGnosisSafe = useMemo(() => connector?.name === 'Safe', [connector])

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

        const provider: any = await connector!.getProvider()
        const resp = (await provider.sdk.txs.getBySafeTxHash(hash)) as TransactionDetails

        if (resp.detailedExecutionInfo && (resp.detailedExecutionInfo as MultisigExecutionDetails)?.safeTxHash) {
          console.debug('debug detailedExecutionInfo', resp.detailedExecutionInfo)
          return (resp.detailedExecutionInfo as MultisigExecutionDetails).safeTxHash as Hash
        }

        return resp.txHash as Hash
      } catch (error) {
        console.error('Failed to get transaction hash from Safe SDK', error)
      }

      return safeTxHash as Hash
    },
    [connector, isGnosisSafe],
  )
}
