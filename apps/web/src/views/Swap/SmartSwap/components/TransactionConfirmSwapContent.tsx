import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'
import { TradeWithStableSwap } from '@pancakeswap/smart-router/evm'
import { ConfirmationModalContent } from '@pancakeswap/uikit'
import { ITrade } from 'config/constants/types'
import { memo, useCallback, useMemo } from 'react'
import { Field } from 'state/swap/actions'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import SwapModalFooter from './SwapModalFooter'
import {
  computeSlippageAdjustedAmounts as computeSlippageAdjustedAmountsWithSmartRouter,
  computeTradePriceBreakdown as computeTradePriceBreakdownWithSmartRouter,
} from '../utils/exchange'
import SwapModalHeader from '../../components/SwapModalHeader'

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param tradeA trade A
 * @param tradeB trade B
 */
function tradeMeaningfullyDiffers(tradeA: ITrade, tradeB: ITrade): boolean {
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !tradeA.inputAmount.currency.equals(tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !tradeA.outputAmount.currency.equals(tradeB.outputAmount.currency) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  )
}

interface TransactionConfirmSwapContentProps {
  trade: TradeWithStableSwap<Currency, Currency, TradeType> | undefined
  originalTrade: ITrade | undefined
  onAcceptChanges: () => void
  allowedSlippage: number
  onConfirm: () => void
  recipient: string
  currencyBalances: {
    INPUT?: CurrencyAmount<Currency>
    OUTPUT?: CurrencyAmount<Currency>
  }
}

const TransactionConfirmSwapContent = ({
  trade,
  originalTrade,
  onAcceptChanges,
  allowedSlippage,
  onConfirm,
  recipient,
  currencyBalances,
}: TransactionConfirmSwapContentProps) => {
  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade],
  )

  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmountsWithSmartRouter(trade, allowedSlippage),
    [trade, allowedSlippage],
  )
  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdownWithSmartRouter(trade), [trade])

  const isEnoughInputBalance = useMemo(() => {
    if (trade?.tradeType !== TradeType.EXACT_OUTPUT) return null

    const isInputBalanceExist = !!(currencyBalances && currencyBalances[Field.INPUT])
    const isInputBalanceBNB = isInputBalanceExist && currencyBalances[Field.INPUT].currency.isNative
    const inputCurrencyAmount = isInputBalanceExist
      ? isInputBalanceBNB
        ? maxAmountSpend(currencyBalances[Field.INPUT])
        : currencyBalances[Field.INPUT]
      : null
    return inputCurrencyAmount && slippageAdjustedAmounts && slippageAdjustedAmounts[Field.INPUT]
      ? inputCurrencyAmount.greaterThan(slippageAdjustedAmounts[Field.INPUT]) ||
          inputCurrencyAmount.equalTo(slippageAdjustedAmounts[Field.INPUT])
      : false
  }, [currencyBalances, trade, slippageAdjustedAmounts])

  const modalHeader = useCallback(() => {
    return trade ? (
      <SwapModalHeader
        inputAmount={trade.inputAmount}
        outputAmount={trade.outputAmount}
        tradeType={trade.tradeType}
        priceImpactWithoutFee={priceImpactWithoutFee}
        allowedSlippage={allowedSlippage}
        slippageAdjustedAmounts={slippageAdjustedAmounts}
        isEnoughInputBalance={isEnoughInputBalance}
        recipient={recipient}
        showAcceptChanges={showAcceptChanges}
        onAcceptChanges={onAcceptChanges}
      />
    ) : null
  }, [
    priceImpactWithoutFee,
    allowedSlippage,
    onAcceptChanges,
    recipient,
    showAcceptChanges,
    trade,
    slippageAdjustedAmounts,
    isEnoughInputBalance,
  ])

  const modalBottom = useCallback(() => {
    return trade ? (
      <SwapModalFooter
        onConfirm={onConfirm}
        trade={trade}
        disabledConfirm={showAcceptChanges}
        slippageAdjustedAmounts={slippageAdjustedAmounts}
        isEnoughInputBalance={isEnoughInputBalance}
      />
    ) : null
  }, [onConfirm, showAcceptChanges, trade, isEnoughInputBalance, slippageAdjustedAmounts])

  return <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
}

export default memo(TransactionConfirmSwapContent)
