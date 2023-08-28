import { useCallback, memo, useState, useEffect } from 'react'
import { Currency, TradeType, CurrencyAmount, ChainId, Token } from '@pancakeswap/sdk'
import {
  Box,
  Link,
  BscScanIcon,
  InjectedModalProps,
  ApproveModalContent,
  SwapPendingModalContent,
  SwapTransactionReceiptModalContent,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { SendTransactionResult } from 'wagmi/actions'
import { getBlockExploreLink, getBlockExploreName } from 'utils'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { WrappedTokenInfo } from '@pancakeswap/token-lists'

import { Field } from 'state/swap/actions'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useUserSlippage } from '@pancakeswap/utils/user'
import { useSwapState } from 'state/swap/hooks'
import { ApprovalState } from 'hooks/useApproveCallback'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { ConfirmModalState, PendingConfirmModalState } from '../types'

import ConfirmSwapModalContainer from '../../components/ConfirmSwapModalContainer'
import { SwapTransactionErrorContent } from '../../components/SwapTransactionErrorContent'
import { TransactionConfirmSwapContent } from '../components'
import ApproveStepFlow from './ApproveStepFlow'

interface ConfirmSwapModalV2Props {
  trade?: SmartRouterTrade<TradeType>
  originalTrade?: SmartRouterTrade<TradeType>
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  attemptingTxn: boolean
  txHash?: string
  approval: ApprovalState
  swapErrorMessage?: string
  showApproveFlow: boolean
  onAcceptChanges: () => void
  onConfirm: () => void
  customOnDismiss?: () => void
  openSettingModal?: () => void
  approveCallback: () => Promise<SendTransactionResult>
}

interface UseConfirmModalStateProps {
  approval: ApprovalState
  onConfirm: () => void
  approveCallback: () => Promise<SendTransactionResult>
}

function isInApprovalPhase(confirmModalState: ConfirmModalState) {
  return (
    confirmModalState === ConfirmModalState.APPROVING_TOKEN || confirmModalState === ConfirmModalState.APPROVE_PENDING
  )
}

const useConfirmModalState = ({ approval, onConfirm, approveCallback }: UseConfirmModalStateProps) => {
  const [confirmModalState, setConfirmModalState] = useState<ConfirmModalState>(ConfirmModalState.REVIEWING)
  const [pendingModalSteps, setPendingModalSteps] = useState<PendingConfirmModalState[]>([])

  const generateRequiredSteps = useCallback(() => {
    const steps: PendingConfirmModalState[] = []
    if (approval === ApprovalState.NOT_APPROVED) {
      steps.push(ConfirmModalState.APPROVING_TOKEN, ConfirmModalState.APPROVE_PENDING)
    }

    steps.push(ConfirmModalState.PENDING_CONFIRMATION)
    return steps
  }, [approval])

  const performStep = useCallback(
    async (step: ConfirmModalState) => {
      switch (step) {
        case ConfirmModalState.APPROVING_TOKEN:
          setConfirmModalState(ConfirmModalState.APPROVING_TOKEN)
          approveCallback()
            .then(() => setConfirmModalState(ConfirmModalState.APPROVE_PENDING))
            .catch(() => onCancel())
          break
        case ConfirmModalState.PENDING_CONFIRMATION:
          setConfirmModalState(ConfirmModalState.PENDING_CONFIRMATION)
          await onConfirm()
          setConfirmModalState(ConfirmModalState.COMPLETED)
          break
        default:
          setConfirmModalState(ConfirmModalState.REVIEWING)
          break
      }
    },
    [approveCallback, onConfirm],
  )

  const startSwapFlow = useCallback(() => {
    const steps = generateRequiredSteps()
    setPendingModalSteps(steps)
    performStep(steps[0])
  }, [generateRequiredSteps, performStep])

  const onCancel = () => {
    setConfirmModalState(ConfirmModalState.REVIEWING)
  }

  useEffect(() => {
    if (isInApprovalPhase(confirmModalState) && approval === ApprovalState.APPROVED) {
      performStep(ConfirmModalState.PENDING_CONFIRMATION)
    }
  }, [approval, confirmModalState, performStep])

  return { confirmModalState, pendingModalSteps, startSwapFlow, onCancel }
}

const ConfirmSwapV2Modal = memo<InjectedModalProps & ConfirmSwapModalV2Props>(function ConfirmSwapModalComp({
  trade,
  txHash,
  approval,
  attemptingTxn,
  originalTrade,
  showApproveFlow,
  currencyBalances,
  swapErrorMessage,
  onDismiss,
  onConfirm,
  approveCallback,
  onAcceptChanges,
  customOnDismiss,
  openSettingModal,
}) {
  const { chainId } = useActiveChainId()
  const { t } = useTranslation()
  const [allowedSlippage] = useUserSlippage()
  const { recipient } = useSwapState()

  const token: Token | undefined = wrappedCurrency(trade?.outputAmount?.currency, chainId)

  const { confirmModalState, pendingModalSteps, startSwapFlow, onCancel } = useConfirmModalState({
    approval,
    approveCallback,
    onConfirm,
  })

  const handleDismiss = useCallback(() => {
    if (customOnDismiss) {
      customOnDismiss()
    }
    onCancel()
    onDismiss?.()
  }, [customOnDismiss, onCancel, onDismiss])

  const topModal = useCallback(() => {
    if (showApproveFlow) {
      if (confirmModalState === ConfirmModalState.APPROVING_TOKEN) {
        return <ApproveModalContent symbol={trade?.inputAmount?.currency?.symbol} />
      }

      if (confirmModalState === ConfirmModalState.APPROVE_PENDING) {
        return (
          <SwapPendingModalContent
            title={t('Allow %symbol% to be used for swapping', { symbol: trade?.inputAmount?.currency?.symbol })}
            currencyA={trade?.inputAmount?.currency}
            currencyB={trade?.outputAmount?.currency}
            amountA={formatAmount(trade?.inputAmount, 6) ?? ''}
            amountB={formatAmount(trade?.outputAmount, 6) ?? ''}
          />
        )
      }
    }

    if (swapErrorMessage) {
      return (
        <SwapTransactionErrorContent
          openSettingModal={openSettingModal}
          onDismiss={handleDismiss}
          message={swapErrorMessage}
        />
      )
    }

    if (attemptingTxn) {
      return (
        <SwapPendingModalContent
          title={t('Confirm Swap')}
          currencyA={trade?.inputAmount?.currency}
          currencyB={trade?.outputAmount?.currency}
          amountA={formatAmount(trade?.inputAmount, 6) ?? ''}
          amountB={formatAmount(trade?.outputAmount, 6) ?? ''}
        />
      )
    }

    if (confirmModalState === ConfirmModalState.PENDING_CONFIRMATION && txHash) {
      return (
        <SwapPendingModalContent
          title={t('Transaction Submitted')}
          currencyA={trade?.inputAmount?.currency}
          currencyB={trade?.outputAmount?.currency}
          amountA={formatAmount(trade?.inputAmount, 6) ?? ''}
          amountB={formatAmount(trade?.outputAmount, 6) ?? ''}
        >
          <AddToWalletButton
            variant="tertiary"
            mt="12px"
            width="fit-content"
            marginTextBetweenLogo="6px"
            textOptions={AddToWalletTextOptions.TEXT_WITH_ASSET}
            tokenAddress={token?.address}
            tokenSymbol={trade?.outputAmount?.currency?.symbol}
            tokenDecimals={token?.decimals}
            tokenLogo={token instanceof WrappedTokenInfo ? token?.logoURI : undefined}
          />
        </SwapPendingModalContent>
      )
    }

    if (confirmModalState === ConfirmModalState.COMPLETED && txHash) {
      return (
        <SwapTransactionReceiptModalContent>
          {chainId && (
            <Link external small href={getBlockExploreLink(txHash, 'transaction', chainId)}>
              {t('View on %site%', { site: getBlockExploreName(chainId) })}
              {chainId === ChainId.BSC && <BscScanIcon color="primary" ml="4px" />}
            </Link>
          )}
        </SwapTransactionReceiptModalContent>
      )
    }

    return (
      <TransactionConfirmSwapContent
        trade={trade}
        recipient={recipient}
        originalTrade={originalTrade}
        allowedSlippage={allowedSlippage}
        currencyBalances={currencyBalances}
        onConfirm={startSwapFlow}
        onAcceptChanges={onAcceptChanges}
      />
    )
  }, [
    trade,
    txHash,
    originalTrade,
    attemptingTxn,
    currencyBalances,
    showApproveFlow,
    swapErrorMessage,
    token,
    chainId,
    recipient,
    allowedSlippage,
    confirmModalState,
    t,
    handleDismiss,
    startSwapFlow,
    onAcceptChanges,
    openSettingModal,
  ])

  if (!chainId) return null

  return (
    <ConfirmSwapModalContainer
      hideTitleAndBackground={confirmModalState !== ConfirmModalState.REVIEWING}
      handleDismiss={handleDismiss}
    >
      <Box>{topModal()}</Box>
      {(confirmModalState === ConfirmModalState.APPROVING_TOKEN ||
        confirmModalState === ConfirmModalState.APPROVE_PENDING ||
        confirmModalState === ConfirmModalState.PENDING_CONFIRMATION) && (
        <ApproveStepFlow confirmModalState={confirmModalState} hideStepIndicators={pendingModalSteps.length === 1} />
      )}
    </ConfirmSwapModalContainer>
  )
})

export default ConfirmSwapV2Modal
