import { useCallback } from 'react'
import { Order } from '@gelatonetwork/limit-orders-lib'

import { useOrderActionHandlers } from 'state/limitOrders/hooks'
import { Field, Rate } from 'state/limitOrders/types'
import { Currency, Price } from '@pancakeswap/sdk'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useSWRConfig } from 'swr'
import {
  OPEN_ORDERS_SWR_KEY,
  EXECUTED_CANCELLED_ORDERS_SWR_KEY,
} from 'views/LimitOrders/hooks/useGelatoLimitOrdersHistory'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import useGelatoLimitOrdersLib from './useGelatoLimitOrdersLib'

export interface GelatoLimitOrdersHandlers {
  handleLimitOrderSubmission: (orderToSubmit: {
    inputToken: string
    outputToken: string
    inputAmount: string
    outputAmount: string
    owner: string
    overrides?: any
  }) => Promise<any>
  handleLimitOrderCancellation: (
    order: Order,
    orderDetails?: {
      inputTokenSymbol: string
      outputTokenSymbol: string
      inputAmount: string
      outputAmount: string
    },
    overrides?: any,
  ) => Promise<any>
  handleInput: (field: Field, value: string) => void
  handleCurrencySelection: (field: Field.INPUT | Field.OUTPUT, currency: Currency) => void
  handleSwitchTokens: () => void
  handleRateType: (rateType: Rate, price?: Price<Currency, Currency>) => void
}

const useGelatoLimitOrdersHandlers = (): GelatoLimitOrdersHandlers => {
  const { account, chainId } = useAccountActiveChain()

  const { mutate } = useSWRConfig()

  const gelatoLimitOrders = useGelatoLimitOrdersLib()

  const addTransaction = useTransactionAdder()

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRateType } = useOrderActionHandlers()

  const handleLimitOrderSubmission = useCallback(
    async (
      orderToSubmit: {
        inputToken: string
        outputToken: string
        inputAmount: string
        outputAmount: string
        owner: string
      },
      overrides?: any,
    ) => {
      if (!gelatoLimitOrders) {
        throw new Error('Could not reach Gelato Limit Orders library')
      }

      if (!chainId) {
        throw new Error('No chainId')
      }

      if (!gelatoLimitOrders?.signer) {
        throw new Error('No signer')
      }

      const { witness, payload, order } = await gelatoLimitOrders.encodeLimitOrderSubmissionWithSecret(
        orderToSubmit.inputToken,
        orderToSubmit.outputToken,
        orderToSubmit.inputAmount,
        orderToSubmit.outputAmount,
        orderToSubmit.owner,
      )

      const tx = await gelatoLimitOrders.signer.sendTransaction({
        ...(overrides ?? {}),
        to: payload.to,
        data: payload.data,
        value: payload.value.toString(),
      })

      const now = Math.round(Date.now() / 1000)

      addTransaction(tx, {
        summary: 'Order submission',
        translatableSummary: { text: 'Order submission' },
        type: 'limit-order-submission',
        order: {
          ...order,
          createdTxHash: tx?.hash.toLowerCase(),
          witness,
          status: 'open',
          updatedAt: now.toString(),
        } as Order,
      })

      mutate(OPEN_ORDERS_SWR_KEY)
      mutate(EXECUTED_CANCELLED_ORDERS_SWR_KEY)

      return tx
    },
    [addTransaction, chainId, gelatoLimitOrders, mutate],
  )

  const handleLimitOrderCancellation = useCallback(
    async (
      orderToCancel: Order,
      orderDetails?: {
        inputTokenSymbol: string
        outputTokenSymbol: string
        inputAmount: string
        outputAmount: string
      },
      overrides?: any,
    ) => {
      if (!gelatoLimitOrders) {
        throw new Error('Could not reach Gelato Limit Orders library')
      }

      if (!chainId) {
        throw new Error('No chainId')
      }

      if (!account) {
        throw new Error('No account')
      }

      const checkIfOrderExists = Boolean(
        orderToCancel.module &&
          orderToCancel.inputToken &&
          orderToCancel.owner &&
          orderToCancel.witness &&
          orderToCancel.data,
      )

      const tx = await gelatoLimitOrders.cancelLimitOrder(
        orderToCancel,
        checkIfOrderExists,
        overrides ?? {
          gasLimit: 2_000_000,
        },
      )

      const now = Math.round(Date.now() / 1000)

      const summary = orderDetails
        ? `Order cancellation: ${orderDetails.inputAmount} ${orderDetails.inputTokenSymbol} for ${orderDetails.outputAmount} ${orderDetails.outputTokenSymbol}`
        : 'Order cancellation'

      const translatableSummary = orderDetails
        ? {
            text: 'Order cancellation: %inputAmount% %inputTokenSymbol% for %outputAmount% %outputTokenSymbol%',
            data: {
              inputAmount: orderDetails.inputAmount,
              inputTokenSymbol: orderDetails.inputTokenSymbol,
              outputAmount: orderDetails.outputAmount,
              outputTokenSymbol: orderDetails.outputTokenSymbol,
            },
          }
        : { text: 'Order cancellation' }

      addTransaction(tx, {
        summary,
        translatableSummary,
        type: 'limit-order-cancellation',
        order: {
          ...orderToCancel,
          updatedAt: now.toString(),
          status: 'cancelled',
          cancelledTxHash: tx?.hash.toLowerCase(),
        },
      })

      mutate(OPEN_ORDERS_SWR_KEY)
      mutate(EXECUTED_CANCELLED_ORDERS_SWR_KEY)

      return tx
    },
    [gelatoLimitOrders, chainId, account, addTransaction, mutate],
  )

  const handleInput = useCallback(
    (field: Field, value: string) => {
      onUserInput(field, value)
    },
    [onUserInput],
  )

  const handleCurrencySelection = useCallback(
    (field: Field.INPUT | Field.OUTPUT, currency: Currency) => {
      onCurrencySelection(field, currency)
    },
    [onCurrencySelection],
  )

  const handleSwitchTokens = useCallback(() => {
    onSwitchTokens()
  }, [onSwitchTokens])

  const handleRateType = useCallback(
    async (rateType: Rate, price?: Price<Currency, Currency>) => {
      if (rateType === Rate.MUL) {
        if (price) onUserInput(Field.PRICE, price.invert().toSignificant(6))
        onChangeRateType(Rate.DIV)
      } else {
        if (price) onUserInput(Field.PRICE, price.toSignificant(6))
        onChangeRateType(Rate.MUL)
      }
    },
    [onChangeRateType, onUserInput],
  )

  return {
    handleLimitOrderSubmission,
    handleLimitOrderCancellation,
    handleInput,
    handleCurrencySelection,
    handleSwitchTokens,
    handleRateType,
  }
}

export default useGelatoLimitOrdersHandlers
