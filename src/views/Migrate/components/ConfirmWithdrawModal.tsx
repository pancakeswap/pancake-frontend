import React, { useCallback } from 'react'
import { Withdraw } from 'peronio-sdk'
import { InjectedModalProps } from 'peronio-uikit'
import { useTranslation } from 'contexts/Localization'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from 'components/TransactionConfirmationModal'
import WithdrawModalFooter from './WithdrawModalFooter'
import WithdrawModalHeader from './WithdrawModalHeader'

interface ConfirmWithdrawModalProps {
  withdraw?: Withdraw
  attemptingTxn: boolean
  txHash?: string
  recipient: string | null
  onConfirm: () => void
  withdrawErrorMessage?: string
  customOnDismiss?: () => void
}

const ConfirmWithdrawModal: React.FC<InjectedModalProps & ConfirmWithdrawModalProps> = ({
  withdraw,
  onConfirm,
  onDismiss,
  customOnDismiss,
  recipient,
  withdrawErrorMessage,
  attemptingTxn,
  txHash,
}) => {
  const { t } = useTranslation()

  const modalHeader = useCallback(() => {
    return withdraw ? <WithdrawModalHeader withdraw={withdraw} recipient={recipient} /> : null
  }, [recipient, withdraw])

  const modalBottom = useCallback(() => {
    return withdraw ? (
      <WithdrawModalFooter onConfirm={onConfirm} withdraw={withdraw} withdrawErrorMessage={withdrawErrorMessage} />
    ) : null
  }, [onConfirm, withdrawErrorMessage, withdraw])

  // text to show while loading
  const pendingText = t('Withdrawing %amountA% %symbolA% for %amountB% %symbolB%', {
    amountA: withdraw?.inputAmount?.toSignificant(6) ?? '',
    symbolA: withdraw?.inputAmount?.currency?.symbol ?? '',
    amountB: withdraw?.outputAmount?.toSignificant(6) ?? '',
    symbolB: withdraw?.outputAmount?.currency?.symbol ?? '',
  })

  const confirmationContent = useCallback(
    () =>
      withdrawErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={withdrawErrorMessage} />
      ) : (
        <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
      ),
    [onDismiss, modalBottom, modalHeader, withdrawErrorMessage],
  )

  return (
    <TransactionConfirmationModal
      title={t('Confirm Withdraw')}
      onDismiss={onDismiss}
      customOnDismiss={customOnDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
      currencyToAdd={withdraw?.outputAmount.currency}
    />
  )
}

export default ConfirmWithdrawModal
