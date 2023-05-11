import { SendTransactionResult } from '@wagmi/core'
// TODO: wagmi
import type { CallOverrides } from 'ethers'
import get from 'lodash/get'
import { useCallback } from 'react'
import { useGasPrice } from 'state/user/hooks'

export function useCallWithGasPrice() {
  const gasPrice = useGasPrice()

  /**
   * Perform a contract call with a gas price returned from useGasPrice
   * @param contract Used to perform the call
   * @param methodName The name of the method called
   * @param methodArgs An array of arguments to pass to the method
   * @param overrides An overrides object to pass to the method. gasPrice passed in here will take priority over the price returned by useGasPrice
   * @returns https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
   */
  const callWithGasPrice = useCallback(
    async (
      contract: any,
      methodName: string,
      methodArgs: any[] | undefined = [],
      overrides: CallOverrides = null,
    ): Promise<SendTransactionResult> => {
      const contractMethod = get(contract.write, methodName)
      const hasManualGasPriceOverride = overrides?.gasPrice
      const hash = await contractMethod(
        methodArgs,
        hasManualGasPriceOverride ? { ...overrides } : { ...overrides, gasPrice },
      )

      return {
        hash,
      }
    },
    [gasPrice],
  )

  return { callWithGasPrice }
}
