import { BigNumber } from '@ethersproject/bignumber'
import { useTranslation } from '@pancakeswap/localization'
import { Currency, TradeType } from '@pancakeswap/sdk'
import isZero from '@pancakeswap/utils/isZero'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { isStableSwap, V2TradeAndStableSwap } from 'config/constants/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { useGasPrice } from 'state/user/hooks'
import { logSwap, logTx } from 'utils/log'
import { Trade as TradeV2V3 } from '@pancakeswap/router-sdk'
import { useProvider, useSigner } from 'wagmi'

import { INITIAL_ALLOWED_SLIPPAGE } from '../config/constants'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin, isAddress } from '../utils'
import { basisPointsToPercent } from '../utils/exchange'
import { transactionErrorToUserReadableMessage } from '../utils/transactionErrorToUserReadableMessage'
import { SwapCall, SwapCallV3 } from './useSwapCallArguments'

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface SuccessfulCall extends SwapCallEstimate {
  gasEstimate: BigNumber
}

interface FailedCall extends SwapCallEstimate {
  error: string
}

interface SwapCallEstimate {
  call: SwapCall | SwapCallV3
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: V2TradeAndStableSwap | TradeV2V3<Currency, Currency, TradeType>, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddress: string | null, // the address of the recipient of the trade, or null if swap should be returned to sender
  swapCalls: SwapCall[] | SwapCallV3[],
): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId } = useActiveWeb3React()
  const gasPrice = useGasPrice()

  const provider = useProvider()
  const { data: signer } = useSigner()

  const { t } = useTranslation()

  const addTransaction = useTransactionAdder()

  const recipient = recipientAddress === null ? account : recipientAddress

  return useMemo(() => {
    if (trade instanceof TradeV2V3<Currency, Currency, TradeType>) {
      return {
        state: SwapCallbackState.VALID,
        callback: async function onSwap(): Promise<string> {
          const estimatedCalls: SwapCallEstimate[] = await Promise.all(
            swapCalls.map((call) => {
              const { address, calldata, value } = call

              const tx =
                !value || isZero(value)
                  ? { from: account, to: address, data: calldata }
                  : {
                      from: account,
                      to: address,
                      data: calldata,
                      value,
                    }

              return provider
                .estimateGas(tx)
                .then((gasEstimate) => {
                  return {
                    call,
                    gasEstimate,
                  }
                })
                .catch((gasError) => {
                  console.debug('Gas estimate failed, trying eth_call to extract error', call)

                  return provider
                    .call(tx)
                    .then((result) => {
                      console.debug('Unexpected successful call after failed estimate gas', call, gasError, result)
                      return { call, error: 'Unexpected issue with estimating the gas. Please try again.' }
                    })
                    .catch((callError) => {
                      console.debug('Call threw error', call, callError)
                      return { call, error: transactionErrorToUserReadableMessage(callError, t) }
                    })
                })
            }),
          )

          // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
          let bestCallOption: SuccessfulCall | SwapCallEstimate | undefined = estimatedCalls.find(
            (el, ix, list): el is SuccessfulCall =>
              'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1]),
          )

          // check if any calls errored with a recognizable error
          if (!bestCallOption) {
            const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call)
            if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error
            const firstNoErrorCall = estimatedCalls.find<SwapCallEstimate>(
              (call): call is SwapCallEstimate => !('error' in call),
            )
            if (!firstNoErrorCall) throw new Error(`Unexpected error. Could not estimate gas for the swap.`)
            bestCallOption = firstNoErrorCall
          }

          const {
            call: { address, calldata, value },
          } = bestCallOption as { call: SwapCallV3 }

          return signer
            .sendTransaction({
              from: account,
              to: address,
              data: calldata,
              // let the wallet try if we can't estimate the gas
              ...('gasEstimate' in bestCallOption ? { gasLimit: calculateGasMargin(bestCallOption.gasEstimate) } : {}),
              ...(value && !isZero(value) ? { value } : {}),
            })
            .then((response: any) => {
              const inputSymbol = trade.inputAmount.currency.symbol
              const outputSymbol = trade.outputAmount.currency.symbol
              const pct = basisPointsToPercent(allowedSlippage)
              const inputAmount =
                trade.tradeType === TradeType.EXACT_INPUT
                  ? trade.inputAmount.toSignificant(3)
                  : trade.maximumAmountIn(pct).toSignificant(3)

              const outputAmount =
                trade.tradeType === TradeType.EXACT_OUTPUT
                  ? trade.outputAmount.toSignificant(3)
                  : trade.minimumAmountOut(pct).toSignificant(3)

              const base = `Swap ${
                trade.tradeType === TradeType.EXACT_OUTPUT ? 'max.' : ''
              } ${inputAmount} ${inputSymbol} for ${
                trade.tradeType === TradeType.EXACT_INPUT ? 'min.' : ''
              } ${outputAmount} ${outputSymbol}`

              const recipientAddressText =
                recipientAddress && isAddress(recipientAddress) ? truncateHash(recipientAddress) : recipientAddress

              const withRecipient = recipient === account ? base : `${base} to ${recipientAddressText}`

              const translatableWithRecipient =
                trade.tradeType === TradeType.EXACT_OUTPUT
                  ? recipient === account
                    ? 'Swap max. %inputAmount% %inputSymbol% for %outputAmount% %outputSymbol%'
                    : 'Swap max. %inputAmount% %inputSymbol% for %outputAmount% %outputSymbol% to %recipientAddress%'
                  : recipient === account
                  ? 'Swap %inputAmount% %inputSymbol% for min. %outputAmount% %outputSymbol%'
                  : 'Swap %inputAmount% %inputSymbol% for min. %outputAmount% %outputSymbol% to %recipientAddress%'

              addTransaction(response, {
                summary: withRecipient,
                translatableSummary: {
                  text: translatableWithRecipient,
                  data: {
                    inputAmount,
                    inputSymbol,
                    outputAmount,
                    outputSymbol,
                    ...(recipient !== account && { recipientAddress: recipientAddressText }),
                  },
                },
                type: 'swap',
              })
              logSwap({
                chainId,
                inputAmount,
                outputAmount,
                input: trade.inputAmount.currency,
                output: trade.outputAmount.currency,
                type: isStableSwap(trade) ? 'StableSwap' : 'V2Swap',
              })
              logTx({ account, chainId, hash: response.hash })

              return response.hash
            })
            .catch((error: any) => {
              // if the user rejected the tx, pass this along
              if (error?.code === 4001) {
                throw new Error('Transaction rejected.')
              } else {
                // otherwise, the error was unexpected and we need to convey that
                console.error(`Swap failed`, error)
                throw new Error(
                  t('Swap failed: %message%', { message: transactionErrorToUserReadableMessage(error, t) }),
                )
              }
            })
        },
        error: null,
      }
    }

    if (!trade || !account || !chainId) {
      return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }
    if (!recipient) {
      if (recipientAddress !== null) {
        return { state: SwapCallbackState.INVALID, callback: null, error: 'Invalid recipient' }
      }
      return { state: SwapCallbackState.LOADING, callback: null, error: null }
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(): Promise<string> {
        const estimatedCalls: SwapCallEstimate[] = await Promise.all(
          swapCalls.map((call) => {
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
                    return { call, error: t('Unexpected issue with estimating the gas. Please try again.') }
                  })
                  .catch((callError) => {
                    console.error('Call threw error', call, callError)

                    return { call, error: transactionErrorToUserReadableMessage(callError, t) }
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
          if (errorCalls.length > 0) throw new Error(errorCalls[errorCalls.length - 1].error)
          throw new Error(t('Unexpected error. Could not estimate gas for the swap.'))
        }

        const {
          call: {
            contract,
            parameters: { methodName, args, value },
          },
          gasEstimate,
        } = successfulEstimation as {
          call: SwapCall
          gasEstimate: BigNumber
        }

        return contract[methodName](...args, {
          gasLimit: calculateGasMargin(gasEstimate),
          gasPrice,
          ...(value && !isZero(value) ? { value, from: account } : { from: account }),
        })
          .then((response: any) => {
            const inputSymbol = trade.inputAmount.currency.symbol
            const outputSymbol = trade.outputAmount.currency.symbol
            const pct = basisPointsToPercent(allowedSlippage)
            const inputAmount =
              trade.tradeType === TradeType.EXACT_INPUT
                ? trade.inputAmount.toSignificant(3)
                : trade.maximumAmountIn(pct).toSignificant(3)

            const outputAmount =
              trade.tradeType === TradeType.EXACT_OUTPUT
                ? trade.outputAmount.toSignificant(3)
                : trade.minimumAmountOut(pct).toSignificant(3)

            const base = `Swap ${
              trade.tradeType === TradeType.EXACT_OUTPUT ? 'max.' : ''
            } ${inputAmount} ${inputSymbol} for ${
              trade.tradeType === TradeType.EXACT_INPUT ? 'min.' : ''
            } ${outputAmount} ${outputSymbol}`

            const recipientAddressText =
              recipientAddress && isAddress(recipientAddress) ? truncateHash(recipientAddress) : recipientAddress

            const withRecipient = recipient === account ? base : `${base} to ${recipientAddressText}`

            const translatableWithRecipient =
              trade.tradeType === TradeType.EXACT_OUTPUT
                ? recipient === account
                  ? 'Swap max. %inputAmount% %inputSymbol% for %outputAmount% %outputSymbol%'
                  : 'Swap max. %inputAmount% %inputSymbol% for %outputAmount% %outputSymbol% to %recipientAddress%'
                : recipient === account
                ? 'Swap %inputAmount% %inputSymbol% for min. %outputAmount% %outputSymbol%'
                : 'Swap %inputAmount% %inputSymbol% for min. %outputAmount% %outputSymbol% to %recipientAddress%'

            addTransaction(response, {
              summary: withRecipient,
              translatableSummary: {
                text: translatableWithRecipient,
                data: {
                  inputAmount,
                  inputSymbol,
                  outputAmount,
                  outputSymbol,
                  ...(recipient !== account && { recipientAddress: recipientAddressText }),
                },
              },
              type: 'swap',
            })
            logSwap({
              chainId,
              inputAmount,
              outputAmount,
              input: trade.inputAmount.currency,
              output: trade.outputAmount.currency,
              type: isStableSwap(trade) ? 'StableSwap' : 'V2Swap',
            })
            logTx({ account, chainId, hash: response.hash })

            return response.hash
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error('Transaction rejected.')
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, methodName, args, value)
              throw new Error(t('Swap failed: %message%', { message: transactionErrorToUserReadableMessage(error, t) }))
            }
          })
      },
      error: null,
    }
  }, [
    trade,
    account,
    chainId,
    recipient,
    swapCalls,
    signer,
    provider,
    t,
    allowedSlippage,
    recipientAddress,
    addTransaction,
    gasPrice,
  ])
}
