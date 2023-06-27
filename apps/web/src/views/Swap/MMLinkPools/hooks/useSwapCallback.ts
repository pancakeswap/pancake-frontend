import { useTranslation } from '@pancakeswap/localization'
import { Currency, SwapParameters, TradeType } from '@pancakeswap/sdk'
import isZero from '@pancakeswap/utils/isZero'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { useMemo } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useGasPrice } from 'state/user/hooks'
import { Hash, hexToBigInt } from 'viem'
import { calculateGasMargin, isAddress } from 'utils'
import { logSwap, logTx } from 'utils/log'
import { isUserRejected } from 'utils/sentry'
import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { TradeWithMM } from '../types'
import { useMMSwapContract } from '../utils/exchange'

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface SwapCall {
  contract: ReturnType<typeof useMMSwapContract>
  parameters: SwapParameters
}

interface SuccessfulCall extends SwapCallEstimate {
  gasEstimate: bigint
}

interface FailedCall extends SwapCallEstimate {
  error: string
}

interface SwapCallEstimate {
  call: SwapCall
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: TradeWithMM<Currency, Currency, TradeType>, // trade to execute, required
  recipientAddress: string | null, // the address of the recipient of the trade, or null if swap should be returned to sender
  swapCalls: SwapCall[],
): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId } = useAccountActiveChain()
  const gasPrice = useGasPrice()

  const { t } = useTranslation()

  const addTransaction = useTransactionAdder()

  const recipient = recipientAddress === null ? account : recipientAddress

  return useMemo(() => {
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
            const options =
              !value || isZero(value) ? { value: undefined, account } : { value: hexToBigInt(value), account }
            return contract.estimateGas[methodName](args, options)
              .then((gasEstimate) => {
                return {
                  call,
                  gasEstimate,
                }
              })
              .catch((gasError) => {
                console.error('Gas estimate failed, trying eth_call to extract error', call)

                return contract.simulate[methodName](args, options)
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
        } = successfulEstimation

        return contract.write[methodName](args, {
          gas: calculateGasMargin(gasEstimate),
          gasPrice,
          ...(value && !isZero(value) ? { value, account } : { account }),
        })
          .then((response: Hash) => {
            const inputSymbol = trade.inputAmount.currency.symbol
            const outputSymbol = trade.outputAmount.currency.symbol
            // const pct = basisPointsToPercent(allowedSlippage)
            const inputAmount = trade.inputAmount.toSignificant(3)

            const outputAmount = trade.outputAmount.toSignificant(3)

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

            addTransaction(
              { hash: response },
              {
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
              },
            )
            logSwap({
              account,
              hash: response,
              chainId,
              inputAmount,
              outputAmount,
              input: trade.inputAmount.currency,
              output: trade.outputAmount.currency,
              type: 'MarketMakerSwap',
            })
            logTx({ account, chainId, hash: response })

            return response
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (isUserRejected(error)) {
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
  }, [trade, account, chainId, recipient, recipientAddress, swapCalls, t, addTransaction, gasPrice])
}
