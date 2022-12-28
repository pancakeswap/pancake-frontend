import { useMemo } from 'react'
import { Order } from '@gelatonetwork/limit-orders-lib'
import { Currency, CurrencyAmount, Fraction, Token } from '@pancakeswap/sdk'
import { useCurrency } from 'hooks/Tokens'
import useGelatoLimitOrdersLib from 'hooks/limitOrders/useGelatoLimitOrdersLib'
import { getBlockExploreLink } from 'utils'
import { useIsTransactionPending } from 'state/transactions/hooks'
import { useActiveChainId } from 'hooks/useActiveChainId'
import getPriceForOneToken from '../utils/getPriceForOneToken'
import { LimitOrderStatus } from '../types'

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
  isExpired: boolean
  isSubmissionPending: boolean
  isCancellationPending: boolean
  bscScanUrls: {
    created: string
    executed: string
    cancelled: string
  }
}

const formatForDisplay = (amount: Fraction) => {
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
  const { chainId } = useActiveChainId()
  const gelatoLibrary = useGelatoLimitOrdersLib()
  const inputToken = useCurrency(order.inputToken)
  const outputToken = useCurrency(order.outputToken)

  const isSubmissionPending = useIsTransactionPending(order.createdTxHash)
  const isCancellationPending = useIsTransactionPending(order.cancelledTxHash ?? undefined)

  const inputAmount = useMemo(() => {
    if (inputToken && order.inputAmount) {
      return CurrencyAmount.fromRawAmount(inputToken, order.inputAmount)
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
      return CurrencyAmount.fromRawAmount(outputToken, rawMinReturn)
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
    isOpen: order.status === LimitOrderStatus.OPEN,
    isCancelled: order.status === LimitOrderStatus.CANCELLED,
    isExecuted: order.status === LimitOrderStatus.EXECUTED,
    isExpired: order.isExpired && order.status === LimitOrderStatus.OPEN,
    isSubmissionPending,
    isCancellationPending,
    bscScanUrls: {
      created: order.createdTxHash ? getBlockExploreLink(order.createdTxHash, 'transaction') : null,
      executed: order.executedTxHash ? getBlockExploreLink(order.executedTxHash, 'transaction') : null,
      cancelled: order.cancelledTxHash ? getBlockExploreLink(order.cancelledTxHash, 'transaction') : null,
    },
  }
}

export default useFormattedOrderData
