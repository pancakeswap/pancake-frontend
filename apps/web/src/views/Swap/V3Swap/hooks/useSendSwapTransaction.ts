import { useTranslation } from '@pancakeswap/localization'
import { ChainId, TradeType } from '@pancakeswap/sdk'
import { SmartRouter, SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { useUserSlippage } from '@pancakeswap/utils/user'
import { SendTransactionResult } from 'wagmi/actions'
import { INITIAL_ALLOWED_SLIPPAGE } from 'config/constants'
import { useMemo } from 'react'
import { useSwapState } from 'state/swap/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { calculateGasMargin, isAddress } from 'utils'
import { basisPointsToPercent } from 'utils/exchange'
import { logSwap, logTx } from 'utils/log'
import { isUserRejected } from 'utils/sentry'
import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'
import { viemClients } from 'utils/viem'
import { Address, Hex, hexToBigInt } from 'viem'
import { useSendTransaction } from 'wagmi'

import { isZero } from '../utils/isZero'

interface SwapCall {
  address: Address
  calldata: Hex
  value: Hex
}

interface SwapCallEstimate {
  call: SwapCall
}

interface SuccessfulCall extends SwapCallEstimate {
  call: SwapCall
  gasEstimate: bigint
}

interface FailedCall extends SwapCallEstimate {
  call: SwapCall
  error: Error
}

export class TransactionRejectedError extends Error {}

// returns a function that will execute a swap, if the parameters are all valid
export default function useSendSwapTransaction(
  account?: Address,
  chainId?: number,
  trade?: SmartRouterTrade<TradeType>, // trade to execute, required
  swapCalls: SwapCall[] = [],
): { callback: null | (() => Promise<SendTransactionResult>) } {
  const { t } = useTranslation()
  const addTransaction = useTransactionAdder()
  const { sendTransactionAsync } = useSendTransaction()
  const publicClient = viemClients[chainId as ChainId]
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
                console.debug('Gas estimate failed, trying eth_call to extract error', call)
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

        const {
          call: { address, calldata, value },
        } = bestCallOption

        return sendTransactionAsync({
          account,
          chainId,
          to: address,
          data: calldata,
          value: value && !isZero(value) ? hexToBigInt(value) : 0n,
          ...('gasEstimate' in bestCallOption ? { gas: calculateGasMargin(bestCallOption.gasEstimate) } : {}),
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
              type: 'V3SmartSwap',
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
              console.error(`Swap failed`, error, address, calldata, value)

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
  ])
}
