import { useCallback } from 'react'
import { Contract, CallOverrides } from '@ethersproject/contracts'
import { useGasPrice } from 'state/user/hooks'
import get from 'lodash/get'
import * as Sentry from '@sentry/react'
import { ContractMethodName, ContractMethodParams } from 'utils/types'

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
    async <C extends Contract, N extends ContractMethodName<C> = ContractMethodName<C>>(
      contract: C,
      methodName: N,
      methodArgs?: ContractMethodParams<C, N>,
      overrides: CallOverrides = null,
    ): Promise<Awaited<ReturnType<C[N]>>> => {
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

      if (tx) {
        Sentry.addBreadcrumb({
          type: 'Transaction',
          message: `Transaction sent: ${tx.hash}`,
          data: {
            hash: tx.hash,
            from: tx.from,
            gasLimit: tx.gasLimit?.toString(),
            nonce: tx.nonce,
          },
        })
      }

      return tx
    },
    [gasPrice],
  )

  return { callWithGasPrice }
}
