import { useSendTransaction, useSimulateTransaction } from '@pancakeswap/awgmi'
import { useCallback } from 'react'
import { useLedgerTimestamp } from './useLedgerTimestamp'

const SAFE_FACTOR = 1.5

export default function useSimulationAndSendTransaction() {
  const getNow = useLedgerTimestamp()

  const { simulateTransactionAsync } = useSimulateTransaction()

  const { sendTransactionAsync } = useSendTransaction()

  const execute = useCallback(
    async (payload, simulateError?: (err: any) => void) => {
      console.info('payload: ', payload)

      let results

      try {
        results = await simulateTransactionAsync({
          payload,
          options: {
            // only use for simulation
            expiration_timestamp_secs: Math.floor(getNow() / 1000 + 5000).toString(),
          },
        })
      } catch (error) {
        // ignore error
        if (simulateError) {
          simulateError(error)
        }
      }

      let options

      if (Array.isArray(results)) {
        const maxGasAmount = Math.ceil(results[0].gas_used * SAFE_FACTOR)
        const gasUnitPrice = results[0].gas_unit_price

        options = { max_gas_amount: maxGasAmount, gas_unit_price: gasUnitPrice }
      }

      return sendTransactionAsync({
        payload,
        options,
      })
    },
    [sendTransactionAsync, simulateTransactionAsync, getNow],
  )

  return execute
}
