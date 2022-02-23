import { useMemo } from 'react'
import { Order } from '@gelatonetwork/limit-orders-lib'
import { Currency, CurrencyAmount, JSBI, Price, Token, TokenAmount } from '@pancakeswap/sdk'
import { useCurrency } from 'hooks/Tokens'
import useGelatoLimitOrdersLib from 'hooks/limitOrders/useGelatoLimitOrdersLib'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getBscScanLink } from 'utils'
import { useIsTransactionPending } from 'state/transactions/hooks'

export interface FormattedOrderData {
  inputToken: Currency | Token
  outputToken: Currency | Token
  inputAmount: CurrencyAmount
  outputAmount: CurrencyAmount
  executionPrice: Price
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

  const executionPrice = useMemo(() => {
    if (outputAmount && outputAmount.greaterThan(0) && inputAmount) {
      const outExp = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(outputAmount.currency.decimals))
      const inExp = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(inputAmount.currency.decimals))
      const pricePerOne = outputAmount.asFraction.divide(inputAmount.asFraction).divide(inExp).multiply(outExp)
      return new Price(inputAmount.currency, outputAmount.currency, pricePerOne.denominator, pricePerOne.numerator)
    }
    return undefined
  }, [inputAmount, outputAmount])

  // TODO: pre-make toSignificant format

  return {
    inputToken,
    outputToken,
    inputAmount,
    outputAmount,
    executionPrice,
    isOpen: order.status === 'open',
    isCancelled: order.status === 'cancelled',
    isExecuted: order.status === 'executed',
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
