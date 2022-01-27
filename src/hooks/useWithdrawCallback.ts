import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { Minter, CallParameters as WithdrawParameters, Withdraw } from 'peronio-sdk'

import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
// import { useGasPrice } from 'state/user/hooks'
import truncateHash from 'utils/truncateHash'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin, getPeronioContract, isAddress } from '../utils'
import isZero from '../utils/isZero'
import useENS from './ENS/useENS'

export enum WithdrawCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface WithdrawCall {
  contract: Contract
  parameters: WithdrawParameters
}

interface SuccessfulCall {
  call: WithdrawCall
  gasEstimate: BigNumber
}

interface FailedCall {
  call: WithdrawCall
  error: Error
}

type EstimatedWithdrawCall = SuccessfulCall | FailedCall

/**
 * Returns the withdraw calls that can be used to make the withdraw
 * @param withdraw withdraw to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName
 */
function useWithdrawCallArguments(
  withdraw: Withdraw | undefined, // withdraw to execute, required
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the withdraw, or null if withdraw should be returned to sender
): WithdrawCall[] {
  const { account, chainId, library } = useActiveWeb3React()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  return useMemo(() => {
    if (!withdraw || !recipient || !library || !account || !chainId) return []

    const contract: Contract | null = getPeronioContract(chainId, library, account)
    if (!contract) {
      return []
    }

    const withdrawMethods = []

    withdrawMethods.push(
      Minter.withdrawCallParameters(withdraw, {
        recipient,
      }),
    )

    return withdrawMethods.map((parameters) => ({ parameters, contract }))
  }, [account, chainId, library, recipient, withdraw])
}

// returns a function that will execute a withdraw, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the withdraw
export function useWithdrawCallback(
  withdraw: Withdraw | undefined, // withdraw to execute, required
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the withdraw, or null if withdraw should be returned to sender
): { state: WithdrawCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId, library } = useActiveWeb3React()
  // const gasPrice = useGasPrice()

  const withdrawCalls = useWithdrawCallArguments(withdraw, recipientAddressOrName)

  const addTransaction = useTransactionAdder()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  return useMemo(() => {
    if (!withdraw || !library || !account || !chainId) {
      return { state: WithdrawCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return { state: WithdrawCallbackState.INVALID, callback: null, error: 'Invalid recipient' }
      }
      return { state: WithdrawCallbackState.LOADING, callback: null, error: null }
    }

    return {
      state: WithdrawCallbackState.VALID,
      callback: async function onWithdraw(): Promise<string> {
        const estimatedCalls: EstimatedWithdrawCall[] = await Promise.all(
          withdrawCalls.map((call) => {
            const {
              parameters: { methodName, args, value },
              contract,
            } = call
            const options = !value || isZero(value) ? {} : { value }

            return contract.estimateGas[methodName](...args, options)
              .then((gasEstimate) => {
                return {
                  call,
                  gasEstimate,
                }
              })
              .catch((gasError) => {
                console.error('Gas estimate failed, trying eth_call to extract error', call)

                return contract.callStatic[methodName](...args, options)
                  .then((result) => {
                    console.error('Unexpected successful call after failed estimate gas', call, gasError, result)
                    return { call, error: new Error('Unexpected issue with estimating the gas. Please try again.') }
                  })
                  .catch((callError) => {
                    console.error('Call threw error', call, callError)
                    const reason: string = callError.reason || callError.data?.message || callError.message
                    const errorMessage = `The transaction cannot succeed due to error: ${
                      reason ?? 'Unknown error, check the logs'
                    }.`

                    return { call, error: new Error(errorMessage) }
                  })
              })
          }),
        )

        // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        const successfulEstimation = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall =>
            'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1]),
        )

        if (!successfulEstimation) {
          const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call)
          if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error
          throw new Error('Unexpected error. Please contact support: none of the calls threw an error')
        }

        const {
          call: {
            contract,
            parameters: { methodName, args, value },
          },
          gasEstimate,
        } = successfulEstimation

        return contract[methodName](...args, {
          gasLimit: calculateGasMargin(gasEstimate),
          ...(value && !isZero(value) ? { value, from: account } : { from: account }),
        })
          .then((response: any) => {
            const inputSymbol = withdraw.inputAmount.currency.symbol
            const outputSymbol = withdraw.outputAmount.currency.symbol
            const inputAmount = withdraw.inputAmount.toSignificant(3)
            const outputAmount = withdraw.outputAmount.toSignificant(3)

            const base = `Withdraw ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`
            const withRecipient =
              recipient === account
                ? base
                : `${base} to ${
                    recipientAddressOrName && isAddress(recipientAddressOrName)
                      ? truncateHash(recipientAddressOrName)
                      : recipientAddressOrName
                  }`

            addTransaction(response, {
              summary: withRecipient,
            })

            return response.hash
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error('Transaction rejected.')
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Withdraw failed`, error, methodName, args, value)
              throw new Error(`Withdraw failed: ${error.message}`)
            }
          })
      },
      error: null,
    }
  }, [withdraw, library, account, chainId, recipient, recipientAddressOrName, withdrawCalls, addTransaction])
}
