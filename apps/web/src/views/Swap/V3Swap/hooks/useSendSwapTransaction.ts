import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { TradeType } from '@pancakeswap/sdk'
import { SmartRouter, SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { useUserSlippage } from '@pancakeswap/utils/user'
import { INITIAL_ALLOWED_SLIPPAGE } from 'config/constants'
import { useMemo } from 'react'
import { useSwapState } from 'state/swap/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { calculateGasMargin, safeGetAddress } from 'utils'
import { basisPointsToPercent } from 'utils/exchange'
import { logSwap, logTx } from 'utils/log'
import { isUserRejected } from 'utils/sentry'
import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'
import { Address, Hex, TransactionExecutionError, UserRejectedRequestError, hexToBigInt } from 'viem'
import { useSendTransaction } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'

import { viemClientsPublicNodes } from 'hooks/usePublicNodeWaitForTransaction'
import { logger } from 'utils/datadog'
import { isZero } from '../utils/isZero'

interface SwapCall {
  address: Address
  calldata: Hex
  value: Hex
}

interface WallchainSwapCall {
  getCall: () => Promise<SwapCall & { gas: string }>
}

interface SwapCallEstimate {
  call: SwapCall | WallchainSwapCall
}

interface SuccessfulCall extends SwapCallEstimate {
  call: SwapCall | WallchainSwapCall
  gasEstimate: bigint
}

interface FailedCall extends SwapCallEstimate {
  call: SwapCall | WallchainSwapCall
  error: Error
}

export class TransactionRejectedError extends Error {}

// returns a function that will execute a swap, if the parameters are all valid
export default function useSendSwapTransaction(
  account?: Address,
  chainId?: number,
  trade?: SmartRouterTrade<TradeType> | null, // trade to execute, required
  swapCalls: SwapCall[] | WallchainSwapCall[] = [],
  type: 'V3SmartSwap' | 'UniversalRouter' = 'V3SmartSwap',
): { callback: null | (() => Promise<SendTransactionResult>) } {
  const { t } = useTranslation()
  const addTransaction = useTransactionAdder()
  const { sendTransactionAsync } = useSendTransaction()
  const publicClient = viemClientsPublicNodes[chainId as ChainId]
  const [allowedSlippage] = useUserSlippage() || [INITIAL_ALLOWED_SLIPPAGE]
  const { recipient } = useSwapState()
  const recipientAddress = recipient === null ? account : recipient

  return useMemo(() => {
    if (!trade || !sendTransactionAsync || !account || !chainId || !publicClient) {
      return { callback: null }
    }
    return {
      callback: async function onSwap(): Promise<SendTransactionResult> {
        const estimatedCalls: SwapCallEstimate[] = await Promise.all(
          swapCalls.map((call) => {
            const { address, calldata, value } = call
            if ('getCall' in call) {
              // Only WallchainSwapCall, don't use rest of pipeline
              return {
                call,
                gasEstimate: undefined,
              }
            }
            const tx =
              !value || isZero(value)
                ? { account, to: address, data: calldata, value: 0n }
                : {
                    account,
                    to: address,
                    data: calldata,
                    value: hexToBigInt(value),
                  }

            return publicClient
              .estimateGas(tx)
              .then((gasEstimate) => {
                return {
                  call,
                  gasEstimate,
                }
              })
              .catch((gasError) => {
                console.debug('Gas estimate failed, trying to extract error', call, gasError)
                return { call, error: transactionErrorToUserReadableMessage(gasError, t) }
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
          if (!firstNoErrorCall) throw new Error(t('Unexpected error. Could not estimate gas for the swap.'))
          bestCallOption = firstNoErrorCall
        }

        const call =
          'getCall' in bestCallOption.call
            ? await bestCallOption.call.getCall()
            : (bestCallOption.call as SwapCall & { gas?: string | bigint })

        if ('error' in call) {
          throw new Error('Route lost. Need to restart.')
        }

        if ('gas' in call && call.gas) {
          // prepared Wallchain's call have gas estimate inside
          call.gas = BigInt(call.gas)
        } else {
          call.gas =
            'gasEstimate' in bestCallOption && bestCallOption.gasEstimate
              ? calculateGasMargin(bestCallOption.gasEstimate)
              : undefined
        }

        return sendTransactionAsync({
          account,
          chainId,
          to: call.address,
          data: call.calldata,
          value: call.value && !isZero(call.value) ? hexToBigInt(call.value) : 0n,
          gas: call.gas,
        })
          .then((response) => {
            const inputSymbol = trade.inputAmount.currency.symbol
            const outputSymbol = trade.outputAmount.currency.symbol
            const pct = basisPointsToPercent(allowedSlippage)
            const inputAmount =
              trade.tradeType === TradeType.EXACT_INPUT
                ? formatAmount(trade.inputAmount, 3)
                : formatAmount(SmartRouter.maximumAmountIn(trade, pct), 3)
            const outputAmount =
              trade.tradeType === TradeType.EXACT_OUTPUT
                ? formatAmount(trade.outputAmount, 3)
                : formatAmount(SmartRouter.minimumAmountOut(trade, pct), 3)

            const base = `Swap ${
              trade.tradeType === TradeType.EXACT_OUTPUT ? 'max.' : ''
            } ${inputAmount} ${inputSymbol} for ${
              trade.tradeType === TradeType.EXACT_INPUT ? 'min.' : ''
            } ${outputAmount} ${outputSymbol}`

            const recipientAddressText =
              recipientAddress && safeGetAddress(recipientAddress) ? truncateHash(recipientAddress) : recipientAddress

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
              account,
              chainId,
              hash: response.hash,
              inputAmount,
              outputAmount,
              input: trade.inputAmount.currency,
              output: trade.outputAmount.currency,
              type,
            })
            logTx({ account, chainId, hash: response.hash })
            return response
          })
          .catch((error) => {
            // if the user rejected the tx, pass this along
            if (isUserRejected(error)) {
              throw new TransactionRejectedError(t('Transaction rejected'))
            } else {
              // otherwise, the error was unexpected and we need to convey that
              logger.warn(
                'Swap failed',
                {
                  chainId,
                  input: trade.inputAmount.currency,
                  output: trade.outputAmount.currency,
                  address: call.address,
                  value: call.value,
                  cause: error instanceof TransactionExecutionError ? error.cause : undefined,
                },
                error,
              )

              throw new Error(`Swap failed: ${transactionErrorToUserReadableMessage(error, t)}`)
            }
          })
      },
    }
  }, [
    trade,
    sendTransactionAsync,
    account,
    chainId,
    publicClient,
    swapCalls,
    t,
    allowedSlippage,
    recipientAddress,
    recipient,
    addTransaction,
    type,
  ])
}

export const userRejectedError = (error: unknown): boolean => {
  return (
    error instanceof UserRejectedRequestError ||
    error instanceof TransactionRejectedError ||
    (typeof error !== 'string' && isUserRejected(error))
  )
}
