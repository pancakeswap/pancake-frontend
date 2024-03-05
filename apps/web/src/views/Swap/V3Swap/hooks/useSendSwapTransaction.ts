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
import { logger } from 'utils/datadog'
import { basisPointsToPercent } from 'utils/exchange'
import { logSwap, logTx } from 'utils/log'
import { isUserRejected } from 'utils/sentry'
import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'
import { viemClients } from 'utils/viem'
import { Address, Hex, TransactionExecutionError, UserRejectedRequestError, hexToBigInt, stringify } from 'viem'
import { useSendTransaction, useWalletClient } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'

import { zkSync } from 'viem/chains'
import { isZero } from '../utils/isZero'

const getEip712Domain = (transaction) => {
  const message = transactionToMessage(transaction as any)

  return {
    domain: {
      name: 'zkSync',
      version: '2',
      chainId: transaction.chainId,
    },
    types: {
      Transaction: [
        { name: 'txType', type: 'uint256' },
        { name: 'from', type: 'uint256' },
        { name: 'to', type: 'uint256' },
        { name: 'gasLimit', type: 'uint256' },
        { name: 'gasPerPubdataByteLimit', type: 'uint256' },
        { name: 'maxFeePerGas', type: 'uint256' },
        { name: 'maxPriorityFeePerGas', type: 'uint256' },
        { name: 'paymaster', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'value', type: 'uint256' },
        { name: 'data', type: 'bytes' },
        { name: 'factoryDeps', type: 'bytes32[]' },
        { name: 'paymasterInput', type: 'bytes' },
      ],
    },
    primaryType: 'Transaction',
    message,
  }
}
function transactionToMessage(transaction: any): any {
  const {
    gas,
    nonce,
    to,
    from,
    value,
    maxFeePerGas,
    maxPriorityFeePerGas,
    factoryDeps,
    paymaster,
    paymasterInput,
    gasPerPubdata,
    data,
  } = transaction

  return {
    txType: 113n,
    from: BigInt(from),
    to: to ? BigInt(to) : 0n,
    gasLimit: gas ?? 0n,
    gasPerPubdataByteLimit: gasPerPubdata ?? 0n,
    maxFeePerGas: maxFeePerGas ?? 0n,
    maxPriorityFeePerGas: maxPriorityFeePerGas ?? 0n,
    paymaster: paymaster ? BigInt(paymaster) : 0n,
    nonce: nonce ? BigInt(nonce) : 0n,
    value: value ?? 0n,
    data: data || '0x0',
    factoryDeps: factoryDeps ?? [],
    paymasterInput: paymasterInput || '0x0',
  }
}

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
): { callback: null | (() => Promise<SendTransactionResult | undefined>) } {
  const { t } = useTranslation()
  const addTransaction = useTransactionAdder()
  const { data: walletClient } = useWalletClient()
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
      callback: async function onSwap(): Promise<SendTransactionResult | undefined> {
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
              ? calculateGasMargin(bestCallOption.gasEstimate, 2000n)
              : undefined
        }

        let sendTxResult: Promise<SendTransactionResult> = Promise.reject()

        // zkSync paymaster
        if (chainId === zkSync.id && trade.outputAmount.currency.isToken) {
          const resp = await fetch(`https://paymaster.zyfi.org/api/v1/erc20_paymaster`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: stringify({
              feeTokenAddress: trade.outputAmount.currency.address,
              gasLimit: call.gas,
              txData: {
                from: account,
                to: call.address,
                value: call.value,
                data: call.calldata,
              },
            }),
          })
          if (resp.ok) {
            const rawTx = await resp.json()
            console.debug('debug rawTx', rawTx)
            const { customData } = rawTx.txData
            const newTx = {
              // type: 'eip712',
              account,
              to: call.address,
              value: call.value && !isZero(call.value) ? hexToBigInt(call.value) : 0n,
              chainId,
              gas: BigInt(rawTx.gasLimit),
              maxFeePerGas: BigInt(rawTx.txData.maxFeePerGas),
              maxPriorityFeePerGas: BigInt(0),
              data: call.calldata,
              gasPerPubdata: BigInt(customData.gasPerPubdata),
              paymaster: customData.paymasterParams.paymaster,
              paymasterInput: customData.paymasterParams.paymasterInput,
            }

            if (walletClient) {
              // sendTxResult = sendTransactionAsync(newTx as any)
              const txRequest = await walletClient.prepareTransactionRequest(newTx as any)
              console.debug('debug txRequest', txRequest)

              const eip712Domain = getEip712Domain({
                ...txRequest,
                chainId,
                from: txRequest.account,
                type: 'eip712',
              })
              const customSignature = await walletClient.signTypedData({
                ...eip712Domain,
                account: txRequest.account,
              } as any)
              console.debug('debug customSig', customSignature)
              const serializedTransaction = zkSync.serializers!.transaction!({
                ...txRequest,
                chainId,
                customSignature,
                type: 'eip712',
              } as any)

              console.debug('debug serializedTransaction', serializedTransaction)
              const p = await walletClient.sendRawTransaction({ serializedTransaction }).then((hash) => {
                return {
                  hash,
                } as SendTransactionResult
              })
              sendTxResult = Promise.resolve(p)
            }
          }
        } else {
          sendTxResult = sendTransactionAsync({
            account,
            chainId,
            to: call.address,
            data: call.calldata,
            value: call.value && !isZero(call.value) ? hexToBigInt(call.value) : 0n,
            gas: call.gas,
          })
        }

        return sendTxResult
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
            console.error('Swap failed', error)
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
                  type,
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
    walletClient,
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
