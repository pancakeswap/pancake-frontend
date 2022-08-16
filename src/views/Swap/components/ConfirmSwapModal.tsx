import { useCallback } from 'react'
import { Trade } from '@pancakeswap/sdk'
import { InjectedModalProps, Modal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { TransactionErrorContent, TransactionSubmittedContent } from 'components/TransactionConfirmationModal'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ConfirmationPendingContent from './ConfirmationPendingContent'
import TransactionConfirmSwapContent from './TransactionConfirmSwapContent'

interface ConfirmSwapModalProps {
  trade?: Trade
  originalTrade?: Trade
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
  const { chainId } = useActiveWeb3React()

  const handleDismiss = useCallback(() => {
    if (customOnDismiss) {
      customOnDismiss()
    }
    onDismiss?.()
  }, [customOnDismiss, onDismiss])

  const { t } = useTranslation()

  const confirmationContent = useCallback(
    () =>
      swapErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={swapErrorMessage} />
      ) : (
        <TransactionConfirmSwapContent
          trade={trade}
          originalTrade={originalTrade}
          onAcceptChanges={onAcceptChanges}
          allowedSlippage={allowedSlippage}
          onConfirm={onConfirm}
          recipient={recipient}
          swapErrorMessage={swapErrorMessage}
        />
      ),
    [onDismiss, trade, originalTrade, onAcceptChanges, allowedSlippage, onConfirm, recipient, swapErrorMessage],
  )

  if (!chainId) return null

  return (
    <Modal title={t('Confirm Swap')} headerBackground="gradients.cardHeader" onDismiss={handleDismiss}>
      {attemptingTxn ? (
        <ConfirmationPendingContent trade={trade} />
      ) : txHash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={txHash}
          onDismiss={handleDismiss}
          currencyToAdd={trade?.outputAmount.currency}
        />
      ) : (
        confirmationContent()
      )}
    </Modal>
  )
}

export default ConfirmSwapModal
