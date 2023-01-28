import { useSendTransaction, useSimulateTransaction } from '@pancakeswap/awgmi'
import { useCallback } from 'react'

const SAFE_FACTOR = 1.5

export default function useSimulationAndSendTransaction() {
  const { simulateTransactionAsync } = useSimulateTransaction()

  const { sendTransactionAsync } = useSendTransaction()

  const execute = useCallback(
    async (payload, simulateError?: (err: any) => void) => {
      console.info('payload: ', payload)

      let results

      try {
        results = await simulateTransactionAsync({ payload })
      } catch (error) {
        console.log(error)
        // ignore error
        if (simulateError) {
          simulateError(error)
        }
      }

      console.log(results)

      let options

      if (Array.isArray(results)) {
        const maxGasAmount = Math.ceil(results[0].gas_used * SAFE_FACTOR)
        const gasUnitPrice = results[0].gas_unit_price

        options = { max_gas_amount: maxGasAmount, gas_unit_price: gasUnitPrice }
      }

      console.log(options)

      if (Array.isArray(results)) {
        return sendTransactionAsync({
          payload: results[0].payload,
          options,
        })
      }

      return sendTransactionAsync({
        payload,
        options,
      })
    },
    [sendTransactionAsync, simulateTransactionAsync],
  )

  return execute
}
