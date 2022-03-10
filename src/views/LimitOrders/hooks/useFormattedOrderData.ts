import { useMemo } from 'react'
import { Order } from '@gelatonetwork/limit-orders-lib'
import { Currency, CurrencyAmount, Price, Token, TokenAmount } from '@pancakeswap/sdk'
import { useCurrency } from 'hooks/Tokens'
import useGelatoLimitOrdersLib from 'hooks/limitOrders/useGelatoLimitOrdersLib'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getBscScanLink } from 'utils'
import { useIsTransactionPending } from 'state/transactions/hooks'
import getPriceForOneToken from '../utils/getPriceForOneToken'
import { LimitOrderType } from '../types'

export interface FormattedOrderData {
  inputToken: Currency | Token
  outputToken: Currency | Token
  inputAmount: string
  outputAmount: string
  executionPrice: string
  invertedExecutionPrice: string
  isOpen: boolean
  isCancelled: boolean
  isExecuted: boolean
  isSubmissionPending: boolean
  isCancellationPending: boolean
  bscScanUrls: {
    created: string
    executed: string
    cancelled: string
  }
}

const formatForDisplay = (amount: CurrencyAmount | Price) => {
  if (!amount) {
    return undefined
  }
  return parseFloat(amount.toSignificant(18)).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  })
}

// Transforms Gelato Order type into types ready to be displayed in UI
const useFormattedOrderData = (order: Order): FormattedOrderData => {
  const { chainId } = useActiveWeb3React()
  const gelatoLibrary = useGelatoLimitOrdersLib()
  const inputToken = useCurrency(order.inputToken)
  const outputToken = useCurrency(order.outputToken)

  const isSubmissionPending = useIsTransactionPending(order.createdTxHash)
  const isCancellationPending = useIsTransactionPending(order.cancelledTxHash ?? undefined)

  const inputAmount = useMemo(() => {
    if (inputToken && order.inputAmount) {
      if (inputToken instanceof Token) {
        return new TokenAmount(inputToken, order.inputAmount)
      }
      return CurrencyAmount.ether(order.inputAmount)
    }
    return undefined
  }, [inputToken, order.inputAmount])

  const rawMinReturn = useMemo(
    () =>
      order.adjustedMinReturn
        ? order.adjustedMinReturn
        : gelatoLibrary && chainId && order.minReturn
        ? gelatoLibrary.getAdjustedMinReturn(order.minReturn)
        : undefined,
    [chainId, gelatoLibrary, order.adjustedMinReturn, order.minReturn],
  )

  const outputAmount = useMemo(() => {
    if (outputToken && rawMinReturn) {
      if (outputToken instanceof Token) {
        return new TokenAmount(outputToken, rawMinReturn)
      }
      return CurrencyAmount.ether(rawMinReturn)
    }
    return undefined
  }, [outputToken, rawMinReturn])

  const executionPrice = useMemo(() => getPriceForOneToken(inputAmount, outputAmount), [inputAmount, outputAmount])

  return {
    inputToken,
    outputToken,
    inputAmount: formatForDisplay(inputAmount),
    outputAmount: formatForDisplay(outputAmount),
    executionPrice: formatForDisplay(executionPrice),
    invertedExecutionPrice: formatForDisplay(executionPrice?.invert()),
    isOpen: order.status === LimitOrderType.OPEN,
    isCancelled: order.status === LimitOrderType.CANCELLED,
    isExecuted: order.status === LimitOrderType.EXECUTED,
    isSubmissionPending,
    isCancellationPending,
    bscScanUrls: {
      created: order.createdTxHash ? getBscScanLink(order.createdTxHash, 'transaction') : null,
      executed: order.executedTxHash ? getBscScanLink(order.executedTxHash, 'transaction') : null,
      cancelled: order.cancelledTxHash ? getBscScanLink(order.cancelledTxHash, 'transaction') : null,
    },
  }
}

export default useFormattedOrderData
