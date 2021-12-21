import { useCallback } from 'react'
import ethers, { Contract, CallOverrides } from 'ethers'
import { useGasPrice } from 'state/user/hooks'
import { get } from 'lodash'
import * as Sentry from '@sentry/react'

/**
 * Perform a contract call with a gas price returned from useGasPrice
 * @param contract Used to perform the call
 * @param methodName The name of the method called
 * @param methodArgs An array of arguments to pass to the method
 * @param overrides An overrides object to pass to the method. gasPrice passed in here will take priority over the price returned by useGasPrice
 * @returns https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
 */
export function useCallWithGasPrice() {
  const gasPrice = useGasPrice()

  const callWithGasPrice = useCallback(
    async (
      contract: Contract,
      methodName: string,
      methodArgs: any[] = [],
      overrides: CallOverrides = null,
    ): Promise<ethers.providers.TransactionResponse> => {
      Sentry.addBreadcrumb({
        type: 'Transaction',
        message: `Call with gas price: ${gasPrice}`,
        data: {
          contractAddress: contract.address,
          methodName,
          methodArgs,
          overrides,
        },
      })
      const contractMethod = get(contract, methodName)
      const hasManualGasPriceOverride = overrides?.gasPrice

      const tx = await contractMethod(
        ...methodArgs,
        hasManualGasPriceOverride ? { ...overrides } : { ...overrides, gasPrice },
      )

      Sentry.addBreadcrumb({
        type: 'Transaction',
        message: `Transaction sent: ${tx.hash}`,
        data: {
          hash: tx.hash,
          from: tx.from,
          gasLimit: tx.gasLimit.toString(),
          nonce: tx.nonce,
        },
      })

      return tx
    },
    [gasPrice],
  )

  return { callWithGasPrice }
}
