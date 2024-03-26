import { useTranslation } from '@pancakeswap/localization'
import { ChainId, TradeType } from '@pancakeswap/sdk'
import { SmartRouterTrade } from '@pancakeswap/smart-router'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { AVERAGE_CHAIN_BLOCK_TIMES } from 'config/constants/averageChainBlockTimes'
import dayjs from 'dayjs'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useMemo } from 'react'
import { useSwapState } from 'state/swap/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { calculateGasMargin, safeGetAddress } from 'utils'
import { logger } from 'utils/datadog'
import { logSwap, logTx } from 'utils/log'
import { isUserRejected } from 'utils/sentry'
import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'
import { viemClients } from 'utils/viem'
import { Address, Hex, TransactionExecutionError, hexToBigInt } from 'viem'
import { useSendTransaction } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'
import { MMSwapCall } from './useSwapCallArguments'

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface SwapCall {
  address: Address
  calldata: Hex
  value: Hex
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
  trade: Pick<SmartRouterTrade<TradeType>, 'inputAmount' | 'outputAmount' | 'tradeType'> | undefined | null, // trade to execute, required
  recipientAddress: string | null, // the address of the recipient of the trade, or null if swap should be returned to sender
  swapCalls: MMSwapCall[],
  expiredAt?: number,
): { state: SwapCallbackState; callback: null | (() => Promise<SendTransactionResult>); error: string | null } {
  const { account, chainId } = useAccountActiveChain()
  const { callback } = useSendMMTransaction(account, chainId, trade, swapCalls, expiredAt)

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
      callback,
      error: null,
    }
  }, [trade, account, chainId, recipient, callback, recipientAddress])
}

const useSendMMTransaction = (
  account?: Address,
  chainId?: number,
  trade?: Pick<SmartRouterTrade<TradeType>, 'inputAmount' | 'outputAmount' | 'tradeType'> | null,
  swapCalls: MMSwapCall[] = [],
  expiredAt?: number,
): { callback: null | (() => Promise<SendTransactionResult>) } => {
  const { t } = useTranslation()
  const addTransaction = useTransactionAdder()
  const { sendTransactionAsync } = useSendTransaction()
  const publicClient = viemClients[chainId as ChainId]
  const { recipient } = useSwapState()
  const recipientAddress = recipient === null ? account : recipient

  return useMemo(() => {
    if (!trade || !account || !chainId || !publicClient || !sendTransactionAsync) {
      return { callback: null }
    }

    return {
      callback: async function callback(): Promise<SendTransactionResult> {
        if (expiredAt && dayjs().unix() > expiredAt - AVERAGE_CHAIN_BLOCK_TIMES[chainId]) {
          throw new Error(t('Order expired. Please try again.'))
        }
        const estimatedCalls: SwapCallEstimate[] = await Promise.all(
          swapCalls.map((call) => {
            const { address, calldata, value } = call
            const tx = {
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
          call: { address, calldata, value },
          gasEstimate,
        } = successfulEstimation

        return sendTransactionAsync({
          account,
          chainId,
          to: address,
          data: calldata,
          value: hexToBigInt(value),
          gas: calculateGasMargin(gasEstimate),
        })
          .then((response) => {
            const { hash } = response
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

            addTransaction(
              { hash },
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
              hash,
              chainId,
              inputAmount,
              outputAmount,
              input: trade.inputAmount.currency,
              output: trade.outputAmount.currency,
              type: 'MarketMakerSwap',
            })
            logTx({ account, chainId, hash })

            return response
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (isUserRejected(error)) {
              throw new Error('Transaction rejected.')
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error)
              logger.warn(
                'Swap failed',
                {
                  chainId,
                  input: trade.inputAmount.currency,
                  output: trade.outputAmount.currency,
                  address,
                  value,
                  type: 'UniversalRouter',
                  target: 'MarketMaker',
                  errorName: error?.name,
                  cause: error instanceof TransactionExecutionError ? error.cause : undefined,
                },
                error,
              )
              throw new Error(t('Swap failed: %message%', { message: transactionErrorToUserReadableMessage(error, t) }))
            }
          })
      },
    }
  }, [
    account,
    addTransaction,
    chainId,
    expiredAt,
    publicClient,
    recipient,
    recipientAddress,
    sendTransactionAsync,
    swapCalls,
    t,
    trade,
  ])
}
