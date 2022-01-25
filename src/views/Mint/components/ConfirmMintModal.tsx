import React, { useCallback } from 'react'
import { Mint } from 'peronio-sdk'
import { InjectedModalProps } from 'peronio-uikit'
import { useTranslation } from 'contexts/Localization'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from 'components/TransactionConfirmationModal'
import MintModalFooter from './MintModalFooter'
import MintModalHeader from './MintModalHeader'

interface ConfirmMintModalProps {
  mint?: Mint
  attemptingTxn: boolean
  txHash?: string
  recipient: string | null
  onConfirm: () => void
  mintErrorMessage?: string
  customOnDismiss?: () => void
}

const ConfirmMintModal: React.FC<InjectedModalProps & ConfirmMintModalProps> = ({
  mint,
  onConfirm,
  onDismiss,
  customOnDismiss,
  recipient,
  mintErrorMessage,
  attemptingTxn,
  txHash,
}) => {
  const { t } = useTranslation()

  const modalHeader = useCallback(() => {
    return mint ? <MintModalHeader mint={mint} recipient={recipient} /> : null
  }, [recipient, mint])

  const modalBottom = useCallback(() => {
    return mint ? <MintModalFooter onConfirm={onConfirm} mint={mint} mintErrorMessage={mintErrorMessage} /> : null
  }, [onConfirm, mintErrorMessage, mint])

  // text to show while loading
  const pendingText = t('Minting %amountA% %symbolA% for %amountB% %symbolB%', {
    amountA: mint?.inputAmount?.toSignificant(6) ?? '',
    symbolA: mint?.inputAmount?.currency?.symbol ?? '',
    amountB: mint?.outputAmount?.toSignificant(6) ?? '',
    symbolB: mint?.outputAmount?.currency?.symbol ?? '',
  })

  const confirmationContent = useCallback(
    () =>
      mintErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={mintErrorMessage} />
      ) : (
        <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
      ),
    [onDismiss, modalBottom, modalHeader, mintErrorMessage],
  )

  return (
    <TransactionConfirmationModal
      title={t('Confirm Mint')}
      onDismiss={onDismiss}
      customOnDismiss={customOnDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
      currencyToAdd={mint?.outputAmount.currency}
    />
  )
}

export default ConfirmMintModal
