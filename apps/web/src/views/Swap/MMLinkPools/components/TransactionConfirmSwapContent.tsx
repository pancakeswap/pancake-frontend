import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'
import { ConfirmationModalContent } from '@pancakeswap/uikit'
import { memo, useCallback, useMemo } from 'react'
import { Field } from 'state/swap/actions'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import SwapModalHeader from 'views/Swap/components/SwapModalHeader'
import { TradeWithMM } from '../types'
import {
  computeSlippageAdjustedAmounts as computeSlippageAdjustedAmountsWithSmartRouter,
  computeTradePriceBreakdown as computeTradePriceBreakdownWithSmartRouter,
} from '../utils/exchange'
import SwapModalFooter from './SwapModalFooter'
import { MMSlippageTolerance } from './MMSlippageTolerance'

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param tradeA trade A
 * @param tradeB trade B
 */
function tradeMeaningfullyDiffers(
  tradeA: TradeWithMM<Currency, Currency, TradeType> | undefined,
  tradeB: TradeWithMM<Currency, Currency, TradeType> | undefined,
): boolean {
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !tradeA.inputAmount.currency.equals(tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !tradeA.outputAmount.currency.equals(tradeB.outputAmount.currency) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  )
}

interface TransactionConfirmSwapContentProps {
  trade: TradeWithMM<Currency, Currency, TradeType> | undefined
  originalTrade: TradeWithMM<Currency, Currency, TradeType> | undefined
  onAcceptChanges: () => void
  onConfirm: () => void
  recipient: string
  currencyBalances: {
    INPUT?: CurrencyAmount<Currency>
    OUTPUT?: CurrencyAmount<Currency>
  }
  isRFQReady: boolean
}

const TransactionConfirmSwapContent = ({
  trade,
  originalTrade,
  onAcceptChanges,
  onConfirm,
  recipient,
  currencyBalances,
  isRFQReady,
}: TransactionConfirmSwapContentProps) => {
  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade],
  )

  const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmountsWithSmartRouter(trade), [trade])
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
        allowedSlippage={<MMSlippageTolerance />}
        slippageAdjustedAmounts={slippageAdjustedAmounts}
        isEnoughInputBalance={isEnoughInputBalance}
        recipient={recipient}
        showAcceptChanges={showAcceptChanges}
        onAcceptChanges={onAcceptChanges}
      />
    ) : null
  }, [
    priceImpactWithoutFee,
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
        isMM
        isRFQReady={isRFQReady}
        onConfirm={onConfirm}
        trade={trade}
        disabledConfirm={showAcceptChanges}
        slippageAdjustedAmounts={slippageAdjustedAmounts}
        isEnoughInputBalance={isEnoughInputBalance}
      />
    ) : null
  }, [onConfirm, showAcceptChanges, trade, isEnoughInputBalance, slippageAdjustedAmounts, isRFQReady])

  return <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
}

export default memo(TransactionConfirmSwapContent)
