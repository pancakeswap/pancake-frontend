import { useCallback } from 'react'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import ethers from 'ethers'

import useToast from 'hooks/useToast'
import { logError } from 'utils/sentry'

export type CatchTxErrorFunction = (
  fn: () => Promise<void>,
  getTx: () => ethers.providers.TransactionResponse,
  final: () => void,
) => Promise<void>

export default function useCatchTxError(): CatchTxErrorFunction {
  const { library } = useWeb3React()
  const { t } = useTranslation()
  const { toastError } = useToast()

  const handleNormalError = useCallback(
    (error) => {
      logError(error)

      t('Please try again. Confirm the transaction and make sure you are paying enough gas!')
    },
    [t],
  )

  return async (
    fn: () => Promise<void>,
    getTx: () => ethers.providers.TransactionResponse,
    final: () => void,
  ): Promise<void> => {
    try {
      await fn()
    } catch (error: any) {
      const tx: ethers.providers.TransactionResponse = getTx()
      if (!tx) {
        handleNormalError(error)
      } else {
        library
          .call(tx, tx.blockNumber)
          .then(() => {
            handleNormalError(error)
          })
          .catch((err: any) => {
            // -32000 is insufficient funds for gas * price + value
            if (err?.data?.code === -32000) {
              handleNormalError(error)
            } else {
              logError(err)
              toastError(t('TX Error'), err?.data?.message)
            }
          })
      }
    } finally {
      final()
    }
  }
}
