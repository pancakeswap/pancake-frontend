import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'
import { ConfirmationModalContent } from 'components/TransactionConfirmationModal'
import { isStableSwap, isV2SwapOrStableSwap, ITrade, isV2SwapOrMixSwap } from 'config/constants/types'
import { memo, useCallback, useMemo } from 'react'
import { Field } from 'state/swap/actions'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from 'utils/exchange'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import {
  computeSlippageAdjustedAmounts as computeSlippageAdjustedAmountsWithSmartRouter,
  computeTradePriceBreakdown as computeTradePriceBreakdownWithSmartRouter,
} from '../SmartSwap/utils/exchange'
import StableSwapModalFooter from '../StableSwap/components/StableSwapModalFooter'
import StableSwapModalHeader from '../StableSwap/components/StableSwapModalHeader'
import SwapModalFooter from './SwapModalFooter'
import SwapModalHeader from './SwapModalHeader'

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
  trade: ITrade | undefined
  originalTrade: ITrade | undefined
  onAcceptChanges: () => void
  allowedSlippage: number
  onConfirm: () => void
  recipient: string
  currencyBalances: {
    INPUT?: CurrencyAmount<Currency>
    OUTPUT?: CurrencyAmount<Currency>
  }
  isStable: boolean
}

const TransactionConfirmSwapContent = ({
  trade,
  originalTrade,
  onAcceptChanges,
  allowedSlippage,
  onConfirm,
  recipient,
  currencyBalances,
  isStable,
}: TransactionConfirmSwapContentProps) => {
  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade],
  )

  const slippageAdjustedAmounts = useMemo(
    isV2SwapOrStableSwap(trade)
      ? () => computeSlippageAdjustedAmounts(trade, allowedSlippage)
      : () => computeSlippageAdjustedAmountsWithSmartRouter(trade, allowedSlippage),
    [trade, allowedSlippage],
  )
  const { priceImpactWithoutFee } = useMemo(
    isV2SwapOrStableSwap(trade)
      ? // @ts-ignore
        () => computeTradePriceBreakdown(trade)
      : () => computeTradePriceBreakdownWithSmartRouter(trade),
    [trade],
  )

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
    const SwapModalHead = isStable ? StableSwapModalHeader : SwapModalHeader

    return trade ? (
      <SwapModalHead
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
    isStable,
  ])

  const modalBottom = useCallback(() => {
    return trade ? (
      isStable && isStableSwap(trade) ? (
        <StableSwapModalFooter
          onConfirm={onConfirm}
          trade={trade}
          disabledConfirm={showAcceptChanges}
          slippageAdjustedAmounts={slippageAdjustedAmounts}
          isEnoughInputBalance={isEnoughInputBalance}
        />
      ) : (
        isV2SwapOrMixSwap(trade) && (
          <SwapModalFooter
            onConfirm={onConfirm}
            trade={trade}
            disabledConfirm={showAcceptChanges}
            slippageAdjustedAmounts={slippageAdjustedAmounts}
            isEnoughInputBalance={isEnoughInputBalance}
          />
        )
      )
    ) : null
  }, [onConfirm, showAcceptChanges, trade, isEnoughInputBalance, slippageAdjustedAmounts, isStable])

  return <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
}

export default memo(TransactionConfirmSwapContent)
