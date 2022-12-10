import { useCallback, memo } from 'react'
import { Trade, Currency, TradeType, CurrencyAmount } from '@pancakeswap/sdk'
import { InjectedModalProps, LinkExternal, Text } from '@pancakeswap/uikit'
import { TransactionErrorContent, TransactionSubmittedContent } from 'components/TransactionConfirmationModal'
import { useTranslation } from '@pancakeswap/localization'
import { Field } from 'state/swap/actions'
import { useActiveChainId } from 'hooks/useActiveChainId'
import AkkaConfirmSwapModalContainer from './AkkaConfirmSwapModalContainer'
import AkkaConfirmationPendingContent from './AkkaConfirmationPendingContent'
import AkkaTransactionConfirmSwapContent from './AkkaTransactionConfirmSwapContent'
import { AkkaRouterTrade } from '../hooks/types'
import { useSwapState } from 'state/swap/hooks'
import { useCurrency } from 'hooks/Tokens'

const PancakeRouterSlippageErrorMsg =
  'This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.'

const SwapTransactionErrorContent = ({ onDismiss, message, openSettingModal }) => {
  const isSlippagedErrorMsg = message?.includes(PancakeRouterSlippageErrorMsg)

  const handleErrorDismiss = useCallback(() => {
    onDismiss?.()
    if (isSlippagedErrorMsg && openSettingModal) {
      openSettingModal()
    }
  }, [isSlippagedErrorMsg, onDismiss, openSettingModal])
  const { t } = useTranslation()

  return isSlippagedErrorMsg ? (
    <TransactionErrorContent
      message={
        <>
          <Text mb="16px">
            {t(
              'This transaction will not succeed either due to price movement or fee on transfer. Try increasing your',
            )}{' '}
            <Text bold display="inline" style={{ cursor: 'pointer' }} onClick={handleErrorDismiss}>
              <u>{t('slippage tolerance.')}</u>
            </Text>
          </Text>
          <LinkExternal
            href="https://docs.pancakeswap.finance/products/pancakeswap-exchange/trade-guide"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {t('What are the potential issues with the token?')}
          </LinkExternal>
        </>
      }
    />
  ) : (
    <TransactionErrorContent message={message} onDismiss={onDismiss} />
  )
}

interface ConfirmSwapModalProps {
  trade?: AkkaRouterTrade
  originalTrade?: AkkaRouterTrade
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  attemptingTxn: boolean
  txHash?: string
  recipient: string | null
  allowedSlippage: number
  onAcceptChanges: () => void
  onConfirm: () => void
  swapErrorMessage?: string
  customOnDismiss?: () => void
  openSettingModal?: () => void
  isStable?: boolean
}

const AkkaConfirmSwapModal: React.FC<React.PropsWithChildren<InjectedModalProps & ConfirmSwapModalProps>> = ({
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
  openSettingModal,
  isStable,
}) => {
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const { chainId } = useActiveChainId()

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
        <AkkaTransactionConfirmSwapContent
          isStable={isStable}
          trade={trade}
          currencyBalances={currencyBalances}
          originalTrade={originalTrade}
          onAcceptChanges={onAcceptChanges}
          allowedSlippage={allowedSlippage}
          onConfirm={onConfirm}
          recipient={recipient}
        />
      ),
    [
      isStable,
      trade,
      originalTrade,
      onAcceptChanges,
      allowedSlippage,
      onConfirm,
      recipient,
      swapErrorMessage,
      onDismiss,
      openSettingModal,
      currencyBalances,
    ],
  )

  if (!chainId) return null

  return (
    <AkkaConfirmSwapModalContainer handleDismiss={handleDismiss}>
      {attemptingTxn ? (
        <AkkaConfirmationPendingContent trade={trade} />
      ) : txHash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={txHash}
          onDismiss={handleDismiss}
          currencyToAdd={outputCurrency}
        />
      ) : (
        confirmationContent()
      )}
    </AkkaConfirmSwapModalContainer>
  )
}

export default memo(AkkaConfirmSwapModal)
