import { useCallback, useMemo } from 'react'
import { Trade, CurrencyAmount, Currency, TradeType } from '@pancakeswap/sdk'
import { InjectedModalProps } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Field } from 'state/swap/actions'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from 'components/TransactionConfirmationModal'
import SwapModalFooter from './SwapModalFooter'
import SwapModalHeader from './SwapModalHeader'
import { maxAmountSpend } from '../../../utils/maxAmountSpend'
import { computeSlippageAdjustedAmounts } from '../../../utils/exchange'

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param tradeA trade A
 * @param tradeB trade B
 */
function tradeMeaningfullyDiffers(
  tradeA: Trade<Currency, Currency, TradeType>,
  tradeB: Trade<Currency, Currency, TradeType>,
): boolean {
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !tradeA.inputAmount.currency.equals(tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !tradeA.outputAmount.currency.equals(tradeB.outputAmount.currency) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  )
}
interface ConfirmSwapModalProps {
  trade?: Trade<Currency, Currency, TradeType>
  originalTrade?: Trade<Currency, Currency, TradeType>
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  attemptingTxn: boolean
  txHash?: string
  recipient: string | null
  allowedSlippage: number
  onAcceptChanges: () => void
  onConfirm: () => void
  swapErrorMessage?: string
  customOnDismiss?: () => void
}

const ConfirmSwapModal: React.FC<React.PropsWithChildren<InjectedModalProps & ConfirmSwapModalProps>> = ({
  trade,
  originalTrade,
  currencyBalances,
  onAcceptChanges,
  allowedSlippage,
  onConfirm,
  onDismiss,
  customOnDismiss,
  recipient,
  swapErrorMessage,
  attemptingTxn,
  txHash,
}) => {
  const { t } = useTranslation()

  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade],
  )

  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [trade, allowedSlippage],
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
    return trade ? (
      <SwapModalHeader
        trade={trade}
        slippageAdjustedAmounts={slippageAdjustedAmounts}
        isEnoughInputBalance={isEnoughInputBalance}
        recipient={recipient}
        showAcceptChanges={showAcceptChanges}
        onAcceptChanges={onAcceptChanges}
      />
    ) : null
  }, [slippageAdjustedAmounts, isEnoughInputBalance, onAcceptChanges, recipient, showAcceptChanges, trade])

  const modalBottom = useCallback(() => {
    return trade ? (
      <SwapModalFooter
        onConfirm={onConfirm}
        trade={trade}
        slippageAdjustedAmounts={slippageAdjustedAmounts}
        isEnoughInputBalance={isEnoughInputBalance}
        disabledConfirm={showAcceptChanges}
        swapErrorMessage={swapErrorMessage}
      />
    ) : null
  }, [slippageAdjustedAmounts, isEnoughInputBalance, onConfirm, showAcceptChanges, swapErrorMessage, trade])

  // text to show while loading
  const pendingText = t('Swapping %amountA% %symbolA% for %amountB% %symbolB%', {
    amountA: trade?.inputAmount?.toSignificant(6) ?? '',
    symbolA: trade?.inputAmount?.currency?.symbol ?? '',
    amountB: trade?.outputAmount?.toSignificant(6) ?? '',
    symbolB: trade?.outputAmount?.currency?.symbol ?? '',
  })

  const confirmationContent = useCallback(
    () =>
      swapErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={swapErrorMessage} />
      ) : (
        <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
      ),
    [onDismiss, modalBottom, modalHeader, swapErrorMessage],
  )

  return (
    <TransactionConfirmationModal
      title={t('Confirm Swap')}
      onDismiss={onDismiss}
      customOnDismiss={customOnDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
      currencyToAdd={trade?.outputAmount.currency}
    />
  )
}

export default ConfirmSwapModal
