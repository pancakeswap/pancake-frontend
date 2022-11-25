import { useCallback, useMemo, memo } from 'react'
import { Currency, Trade, TradeType } from '@pancakeswap/sdk'
import { ConfirmationModalContent } from 'components/TransactionConfirmationModal'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { Field } from 'state/swap/actions'
import { computeSlippageAdjustedAmounts } from 'utils/exchange'
import AkkaSwapModalFooter from './AkkaSwapModalFooter'
import AkkaSwapModalHeader from './AkkaSwapModalHeader'

const AkkaTransactionConfirmSwapContent = ({
  trade,
  originalTrade,
  onAcceptChanges,
  allowedSlippage,
  onConfirm,
  recipient,
  currencyBalances,
  isStable,
}) => {

  const isEnoughInputBalance = useMemo(() => {
    const isInputBalanceExist = !!(currencyBalances && currencyBalances[Field.INPUT])
    const isInputBalanceBNB = isInputBalanceExist && currencyBalances[Field.INPUT].currency.isNative
    const inputCurrencyAmount = isInputBalanceExist
      ? isInputBalanceBNB
        ? maxAmountSpend(currencyBalances[Field.INPUT])
        : currencyBalances[Field.INPUT]
      : null
    return inputCurrencyAmount
  }, [currencyBalances, trade])

  const modalHeader = useCallback(() => {
    return trade ? (
      <AkkaSwapModalHeader
        trade={trade}
        allowedSlippage={allowedSlippage}
        isEnoughInputBalance={isEnoughInputBalance}
        recipient={recipient}
        onAcceptChanges={onAcceptChanges}
      />
    ) : null
  }, [
    allowedSlippage,
    onAcceptChanges,
    recipient,
    trade,
    isEnoughInputBalance,
    isStable,
  ])

  const modalBottom = useCallback(() => {
    return trade ? (
      <AkkaSwapModalFooter
        onConfirm={onConfirm}
        trade={trade}
        isEnoughInputBalance={isEnoughInputBalance}
      />
    ) : null
  }, [onConfirm, trade, isEnoughInputBalance, isStable])

  return <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
}

export default memo(AkkaTransactionConfirmSwapContent)
