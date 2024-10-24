import { SimulateTransactionError, useSendTransaction, useSimulateTransaction } from '@pancakeswap/awgmi'
import { useCallback } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { useLedgerTimestamp } from './useLedgerTimestamp'

const SAFE_FACTOR = 1.5

export default function useSimulationAndSendTransaction() {
  const getNow = useLedgerTimestamp()

  const { t } = useTranslation()

  const { simulateTransactionAsync } = useSimulateTransaction()

  const { sendTransactionAsync } = useSendTransaction()

  const execute = useCallback(
    async (payload, simulateError?: (err: any) => void) => {
      console.info('payload: ', payload)

      let results

      try {
        results = await simulateTransactionAsync({
          payload,
          transactionBuildOptions: {
            // only use for simulation
            expireTimestamp: Math.floor(getNow() / 1000) + 10,
          },
        })
      } catch (error) {
        if (error instanceof SimulateTransactionError) {
          if (error.tx.vm_status.includes('TRANSACTION_EXPIRED')) {
            // eslint-disable-next-line no-param-reassign
            error.tx.vm_status += `\n${t(
              'Please check your date and time settings, and ensure that they are synced correctly.',
            )}`
          }
        }
        // ignore error
        if (simulateError) {
          simulateError(error)
        }
      }

      let options

      if (Array.isArray(results)) {
        const maxGasAmount = Math.ceil(results[0].gas_used * SAFE_FACTOR)
        const gasUnitPrice = results[0].gas_unit_price

        options = {
          max_gas_amount: maxGasAmount,
          gas_unit_price: gasUnitPrice,
          expiration_timestamp_secs: (Math.floor(getNow() / 1000) + 10).toString(),
        }
      }

      return sendTransactionAsync({
        payload,
        options,
      }).catch((error) => {
        if (error.message.includes('TRANSACTION_EXPIRED')) {
          // eslint-disable-next-line no-param-reassign
          error.message += `\n${t(
            'Please check your date and time settings, and ensure that they are synced correctly.',
          )}`
        }
        throw error
      })
    },
    [sendTransactionAsync, simulateTransactionAsync, getNow, t],
  )

  return execute
}
