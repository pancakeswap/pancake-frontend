import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'
import { ConfirmationModalContent } from '@pancakeswap/widgets-internal'
import { memo, useCallback, useMemo } from 'react'
import { Field } from 'state/swap/actions'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import SwapModalHeaderV2 from 'views/Swap/components/SwapModalHeaderV2'
import { InterfaceOrder, isXOrder } from 'views/Swap/utils'
import {
  computeSlippageAdjustedAmounts as computeSlippageAdjustedAmountsWithSmartRouter,
  computeTradePriceBreakdown as computeTradePriceBreakdownWithSmartRouter,
} from '../utils/exchange'
import { SwapModalFooterV2 } from './SwapModalFooterV2'

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param tradeA trade A
 * @param tradeB trade B
 */
function tradeMeaningfullyDiffers(tradeA: InterfaceOrder['trade'], tradeB: InterfaceOrder['trade']): boolean {
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !tradeA.inputAmount.currency.equals(tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !tradeA.outputAmount.currency.equals(tradeB.outputAmount.currency) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  )
}

interface TransactionConfirmSwapContentV2Props {
  order: InterfaceOrder | undefined | null
  originalOrder: InterfaceOrder | undefined | null
  // trade: Trade | undefined | null
  // originalTrade: Trade | undefined | null
  onAcceptChanges: () => void
  allowedSlippage: number
  onConfirm: () => void
  recipient?: string | null
  currencyBalances?: {
    INPUT?: CurrencyAmount<Currency>
    OUTPUT?: CurrencyAmount<Currency>
  }
}

export const TransactionConfirmSwapContentV2 = memo<TransactionConfirmSwapContentV2Props>(
  function TransactionConfirmSwapContentV2Comp({
    order,
    recipient,
    originalOrder,
    allowedSlippage,
    currencyBalances,
    onConfirm,
    onAcceptChanges,
  }) {
    const showAcceptChanges = useMemo(
      () => Boolean(order && originalOrder && tradeMeaningfullyDiffers(order.trade, originalOrder.trade)),
      [originalOrder, order],
    )

    const slippageAdjustedAmounts = useMemo(
      () => computeSlippageAdjustedAmountsWithSmartRouter(order, allowedSlippage),
      [order, allowedSlippage],
    )
    const { priceImpactWithoutFee, lpFeeAmount } = useMemo(
      () => computeTradePriceBreakdownWithSmartRouter(isXOrder(order) ? undefined : order?.trade),
      [order],
    )

    const isEnoughInputBalance = useMemo(() => {
      if (order?.trade?.tradeType !== TradeType.EXACT_OUTPUT) return null

      const isInputBalanceExist = !!(currencyBalances && currencyBalances[Field.INPUT])
      const isInputBalanceBNB = isInputBalanceExist && currencyBalances[Field.INPUT]?.currency.isNative
      const inputCurrencyAmount = isInputBalanceExist
        ? isInputBalanceBNB
          ? maxAmountSpend(currencyBalances[Field.INPUT])
          : currencyBalances[Field.INPUT]
        : null
      return inputCurrencyAmount && slippageAdjustedAmounts && slippageAdjustedAmounts[Field.INPUT]
        ? inputCurrencyAmount.greaterThan(slippageAdjustedAmounts[Field.INPUT]) ||
            inputCurrencyAmount.equalTo(slippageAdjustedAmounts[Field.INPUT])
        : false
    }, [order?.trade?.tradeType, currencyBalances, slippageAdjustedAmounts])

    const modalHeader = useCallback(() => {
      return order ? (
        <SwapModalHeaderV2
          inputAmount={order.trade.inputAmount}
          outputAmount={order.trade.outputAmount}
          currencyBalances={currencyBalances}
          tradeType={order.trade.tradeType}
          priceImpactWithoutFee={priceImpactWithoutFee ?? undefined}
          isEnoughInputBalance={isEnoughInputBalance ?? undefined}
          recipient={recipient ?? undefined}
          showAcceptChanges={showAcceptChanges}
          onAcceptChanges={onAcceptChanges}
        />
      ) : null
    }, [
      order,
      currencyBalances,
      priceImpactWithoutFee,
      isEnoughInputBalance,
      recipient,
      showAcceptChanges,
      onAcceptChanges,
    ])

    const modalBottom = useCallback(() => {
      return order ? (
        <SwapModalFooterV2
          order={order}
          tradeType={order.trade.tradeType}
          inputAmount={order.trade.inputAmount}
          outputAmount={order.trade.outputAmount}
          lpFee={lpFeeAmount ?? undefined}
          priceImpact={priceImpactWithoutFee ?? undefined}
          disabledConfirm={showAcceptChanges}
          allowedSlippage={allowedSlippage}
          slippageAdjustedAmounts={slippageAdjustedAmounts ?? undefined}
          isEnoughInputBalance={isEnoughInputBalance ?? undefined}
          onConfirm={onConfirm}
        />
      ) : null
    }, [
      order,
      lpFeeAmount,
      priceImpactWithoutFee,
      showAcceptChanges,
      allowedSlippage,
      slippageAdjustedAmounts,
      isEnoughInputBalance,
      onConfirm,
    ])

    return <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
  },
)
