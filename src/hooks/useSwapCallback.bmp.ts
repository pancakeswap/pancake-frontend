import { BigNumber } from '@ethersproject/bignumber'
import { useTracker } from 'contexts/AnalyticsContext'
import { Contract } from '@ethersproject/contracts'
import { Currency, JSBI, Percent, Router, SwapParameters, Trade, TradeType } from '@pancakeswap/sdk'
import { TranslateFunction, useTranslation } from 'contexts/Localization'
import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useGasPrice } from 'state/user/hooks'
import truncateHash from 'utils/truncateHash'
import { BIPS_BASE, INITIAL_ALLOWED_SLIPPAGE } from '../config/constants'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin, getRouterContract, isAddress } from '../utils'
import isZero from '../utils/isZero'
import useTransactionDeadline from './useTransactionDeadline'
import useENS from './ENS/useENS'
import { captureException } from '@binance/sentry-miniapp'
import { HitBuilders } from 'utils/ga'
import { useBUSDCurrencyAmount } from './useBUSDPrice'

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface SwapCall {
  contract: Contract
  parameters: SwapParameters
}

interface SuccessfulCall {
  call: SwapCall
  gasEstimate: BigNumber
}

interface FailedCall {
  call: SwapCall
  error: Error
}

type EstimatedSwapCall = SuccessfulCall | FailedCall

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName
 */
function useSwapCallArguments(
  trade: Trade | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): SwapCall[] {
  const { account, chainId, library } = useActiveWeb3React()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress
  const deadline = useTransactionDeadline()

  return useMemo(() => {
    if (!trade || !recipient || !library || !account || !chainId || !deadline) return []

    const contract = getRouterContract(chainId, library, account)
    if (!contract) {
      return []
    }

    const swapMethods = []

    swapMethods.push(
      Router.swapCallParameters(trade, {
        feeOnTransfer: false,
        allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
        recipient,
        deadline: deadline.toNumber(),
      }),
    )

    if (trade.tradeType === TradeType.EXACT_INPUT) {
      swapMethods.push(
        Router.swapCallParameters(trade, {
          feeOnTransfer: true,
          allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
          recipient,
          deadline: deadline.toNumber(),
        }),
      )
    }

    return swapMethods.map((parameters) => ({ parameters, contract }))
  }, [account, allowedSlippage, chainId, deadline, library, recipient, trade])
}
// priority 1. busd/usdt/bnb  3. input
function useGetBestBUSDPrice(trade?: Trade) {
  let bestCurrency
  let bestCurrencyAmount
  if (trade) {
    const {
      inputAmount: { currency: inputCurrency },
      outputAmount: { currency: outputCurrency },
    } = trade
    const inputAmount = trade.inputAmount.toSignificant(3)
    const outputAmount = trade.outputAmount.toSignificant(3)
    bestCurrency = inputCurrency
    bestCurrencyAmount = inputAmount
    if (['BUSD', 'USDT', 'BNB'].some((item) => item === outputCurrency.symbol)) {
      bestCurrency = outputCurrency
      bestCurrencyAmount = outputAmount
    }
  }
  console.log(
    '🚀 ~ file: useSwapCallback.bmp.ts ~ line 108 ~ useGetBestBUSDPrice ~ bestCurrency, +bestCurrencyAmount',
    bestCurrency,
    +bestCurrencyAmount,
  )
  const value = useBUSDCurrencyAmount(bestCurrency, +bestCurrencyAmount)
  return value
}
// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: Trade | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId, library } = useActiveWeb3React()
  const tradeVolume = useGetBestBUSDPrice(trade) // use to track

  const gasPrice = useGasPrice()

  const swapCalls = useSwapCallArguments(trade, allowedSlippage, recipientAddressOrName)

  const { t } = useTranslation()

  const addTransaction = useTransactionAdder()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  const tracker = useTracker()
  return useMemo(() => {
    if (!trade || !library || !account || !chainId) {
      return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return { state: SwapCallbackState.INVALID, callback: null, error: 'Invalid recipient' }
      }
      return { state: SwapCallbackState.LOADING, callback: null, error: null }
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(): Promise<string> {
        const estimatedCalls: EstimatedSwapCall[] = await Promise.all(
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
                    return { call, error: new Error('Unexpected issue with estimating the gas. Please try again.') }
                  })
                  .catch((callError) => {
                    console.error('Call threw error', call, callError)
                    // const reason: string = callError.reason || callError.data?.message || callError.message
                    // const errorMessage = `The transaction cannot succeed due to error: ${
                    //   reason ?? 'Unknown error, check the logs'
                    // }.`

                    // return { call, error: new Error(errorMessage) }
                    captureException(callError)
                    return { call, error: new Error(swapErrorToUserReadableMessage(callError, t)) }
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
          gasPrice,
          ...(value && !isZero(value) ? { value, from: account } : { from: account }),
        })
          .then((response: any) => {
            const inputSymbol = trade.inputAmount.currency.symbol
            const outputSymbol = trade.outputAmount.currency.symbol
            const inputAmount = trade.inputAmount.toSignificant(3)
            const outputAmount = trade.outputAmount.toSignificant(3)

            const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`
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

            // event track
            if (recipient === account) {
              const track = {
                account,
                txHash: response.hash,
                from: `${inputAmount} ${inputSymbol}`,
                to: `${outputAmount} ${outputSymbol}`,
                value: tradeVolume.toFixed(3),
              }

              tracker.send(
                new HitBuilders.EventBuilder()
                  .setCategory('swap')
                  .setAction('transactionSubmitted')
                  .setLabel(JSON.stringify(track)) //  optional
                  .setValue(Math.ceil(tradeVolume))
                  .build(),
              )
            }
            return response.hash
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error('Transaction rejected.')
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, methodName, args, value)
              // throw new Error(`Swap failed: ${error.message}`)
              captureException(error)
              throw new Error(t('Swap failed: %message%', { message: swapErrorToUserReadableMessage(error, t) }))
            }
          })
      },
      error: null,
    }
  }, [trade, library, account, chainId, recipient, recipientAddressOrName, swapCalls, addTransaction, gasPrice, t])
}

function swapErrorToUserReadableMessage(error: any, t: TranslateFunction) {
  let reason: string | undefined
  while (error) {
    reason = error.reason ?? error.message ?? reason
    // eslint-disable-next-line no-param-reassign
    error = error.error ?? error.data?.originalError
  }

  if (reason?.indexOf('execution reverted: ') === 0) reason = reason.substring('execution reverted: '.length)

  switch (reason) {
    case 'PancakeRouter: EXPIRED':
      return t(
        'The transaction could not be sent because the deadline has passed. Please check that your transaction deadline is not too low.',
      )
    case 'PancakeRouter: INSUFFICIENT_OUTPUT_AMOUNT':
    case 'PancakeRouter: EXCESSIVE_INPUT_AMOUNT':
      return t(
        'This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.',
      )
    case 'TransferHelper: TRANSFER_FROM_FAILED':
      return t('The input token cannot be transferred. There may be an issue with the input token.')
    case 'Pancake: TRANSFER_FAILED':
      return t('The output token cannot be transferred. There may be an issue with the output token.')
    default:
      if (reason?.indexOf('undefined is not an object') !== -1) {
        console.error(error, reason)
        return t(
          'An error occurred when trying to execute this swap. You may need to increase your slippage tolerance. If that does not work, there may be an incompatibility with the token you are trading.',
        )
      }
      return t('Unknown error%reason%. Try increasing your slippage tolerance.', {
        reason: reason ? `: "${reason}"` : '',
      })
  }
}
