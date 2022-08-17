import { useCallback, memo } from 'react'
import { Trade, Currency, TradeType } from '@pancakeswap/sdk'
import { InjectedModalProps, LinkExternal, Text } from '@pancakeswap/uikit'
import { TransactionErrorContent, TransactionSubmittedContent } from 'components/TransactionConfirmationModal'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ConfirmationPendingContent from './ConfirmationPendingContent'
import TransactionConfirmSwapContent from './TransactionConfirmSwapContent'
import ConfirmSwapModalContainer from './ConfirmSwapModalContainer'
import useTranslation from '../../../../packages/localization/src/useTranslation'

const PancakeRouterSlippageErrorMsg =
  'This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.'

const SwapTransactionErrorContent = ({ onDismiss, message, openSettingModal }) => {
  const handleErrorDismiss = useCallback(() => {
    onDismiss?.()
    if (message?.includes(PancakeRouterSlippageErrorMsg) && openSettingModal) {
      openSettingModal()
    }
  }, [message, onDismiss, openSettingModal])
  const { t } = useTranslation()

  const slippageElement = (
    <>
      <Text mb="16px">
        {t('This transaction will not succeed either due to price movement or fee on transfer. Try increasing your')}{' '}
        <Text bold display="inline" style={{ cursor: 'pointer' }} onClick={handleErrorDismiss}>
          <u>{t('slippage tolerance.')}</u>
        </Text>
      </Text>
      <LinkExternal
        href="https://docs.pancakeswap.finance/products/pancakeswap-mini-program/mini-program-faq"
        style={{ width: '100%', justifyContent: 'center' }}
      >
        {t('What are the potential issues with the token?')}
      </LinkExternal>
    </>
  )

  return <TransactionErrorContent message={slippageElement} />
}

interface ConfirmSwapModalProps {
  trade?: Trade<Currency, Currency, TradeType>
  originalTrade?: Trade<Currency, Currency, TradeType>
  attemptingTxn: boolean
  txHash?: string
  recipient: string | null
  allowedSlippage: number
  onAcceptChanges: () => void
  onConfirm: () => void
  swapErrorMessage?: string
  customOnDismiss?: () => void
  openSettingModal?: () => void
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
  openSettingModal,
}) => {
  const { chainId } = useActiveWeb3React()

  const handleDismiss = useCallback(() => {
    if (customOnDismiss) {
      customOnDismiss()
    }
    onDismiss?.()
  }, [customOnDismiss, onDismiss])

  const confirmationContent = useCallback(
    () =>
      swapErrorMessage ? (
        <SwapTransactionErrorContent
          openSettingModal={openSettingModal}
          onDismiss={onDismiss}
          message={swapErrorMessage}
        />
      ) : (
        <TransactionConfirmSwapContent
          trade={trade}
          originalTrade={originalTrade}
          onAcceptChanges={onAcceptChanges}
          allowedSlippage={allowedSlippage}
          onConfirm={onConfirm}
          recipient={recipient}
        />
      ),
    [
      trade,
      originalTrade,
      onAcceptChanges,
      allowedSlippage,
      onConfirm,
      recipient,
      swapErrorMessage,
      onDismiss,
      openSettingModal,
    ],
  )

  if (!chainId) return null

  return (
    <ConfirmSwapModalContainer handleDismiss={handleDismiss}>
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
    </ConfirmSwapModalContainer>
  )
}

export default memo(ConfirmSwapModal)
