import { ChainId } from '@pancakeswap/chains'
import {
  DetailedExecutionInfoType,
  type MultisigExecutionDetails,
  type TransactionDetails,
} from '@safe-global/safe-gateway-typescript-sdk'
import { AVERAGE_CHAIN_BLOCK_TIMES } from 'config/constants/averageChainBlockTimes'
import { useCallback, useMemo } from 'react'
import { wait } from 'state/multicall/retry'
import { Hash } from 'viem'
import { useAccount } from 'wagmi'

export const useSafeTxHashTransformer = () => {
  const { connector, chainId } = useAccount()
  const isGnosisSafe = useMemo(() => connector?.name === 'Safe', [connector])
  const confirmationSeconds = chainId ? AVERAGE_CHAIN_BLOCK_TIMES[chainId] : AVERAGE_CHAIN_BLOCK_TIMES[ChainId.BSC]

  return useCallback(
    async <T = Hash | TransactionDetails>(safeTxHash: T, confirmationsRequired = 1): Promise<Hash> => {
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

        await wait(confirmationSeconds * confirmationsRequired * 1000)
        const provider: any = await connector!.getProvider()
        const resp = (await provider.sdk.txs.getBySafeTxHash(hash)) as TransactionDetails

        if (resp.txHash) return resp.txHash as Hash

        if (resp.detailedExecutionInfo && resp.detailedExecutionInfo.type === DetailedExecutionInfoType.MULTISIG) {
          console.debug('debug detailedExecutionInfo', resp.detailedExecutionInfo)
          return resp.detailedExecutionInfo.safeTxHash as Hash
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
