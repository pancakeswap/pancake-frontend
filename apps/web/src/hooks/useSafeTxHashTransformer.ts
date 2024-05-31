import type { MultisigExecutionDetails, TransactionDetails } from '@safe-global/safe-gateway-typescript-sdk'
import { useCallback, useMemo } from 'react'
import { Hash } from 'viem'
import { useAccount } from 'wagmi'

export const useSafeTxHashTransformer = () => {
  const { connector } = useAccount()
  const isGnosisSafe = useMemo(() => connector?.name === 'Safe', [connector])

  return useCallback(
    async <T = Hash | TransactionDetails>(safeTxHash: T): Promise<Hash> => {
      if (!isGnosisSafe) return safeTxHash as Hash
      let hash = safeTxHash as Hash

      try {
        if (typeof safeTxHash !== 'string') {
          const detailedExecutionInfo = (safeTxHash as TransactionDetails)
            ?.detailedExecutionInfo as MultisigExecutionDetails

          // eslint-disable-next-line no-param-reassign
          hash = detailedExecutionInfo?.safeTxHash as Hash
        }

        if (!hash) {
          return safeTxHash as Hash
        }

        const provider: any = await connector!.getProvider()

        const { txHash } = (await provider.sdk.txs.getBySafeTxHash(hash)) ?? hash
        return txHash as Hash
      } catch (error) {
        console.error('Failed to get transaction hash from Safe SDK', error)
      }

      return safeTxHash as Hash
    },
    [connector, isGnosisSafe],
  )
}
