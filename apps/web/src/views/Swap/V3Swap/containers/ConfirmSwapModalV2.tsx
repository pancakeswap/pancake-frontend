import { useCallback, memo, useMemo, useState, useEffect } from 'react'
import { Currency, TradeType, CurrencyAmount } from '@pancakeswap/sdk'
import {
  Box,
  InjectedModalProps,
  ConfirmationPendingContent,
  ApproveModalContent,
  ApprovePendingModalContent,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { SendTransactionResult } from 'wagmi/actions'

import { TransactionSubmittedContent } from 'components/TransactionConfirmationModal'
import { Field } from 'state/swap/actions'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useUserSlippage } from '@pancakeswap/utils/user'
import { useSwapState } from 'state/swap/hooks'
import { ApprovalState } from 'hooks/useApproveCallback'
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

  // text to show while loading
  const pendingText = useMemo(() => {
    return t('Swapping %amountA% %symbolA% for %amountB% %symbolB%', {
      amountA: formatAmount(trade?.inputAmount, 6) ?? '',
      symbolA: trade?.inputAmount?.currency?.symbol ?? '',
      amountB: formatAmount(trade?.outputAmount, 6) ?? '',
      symbolB: trade?.outputAmount?.currency?.symbol ?? '',
    })
  }, [t, trade])

  const topModal = useCallback(() => {
    if (showApproveFlow) {
      if (confirmModalState === ConfirmModalState.APPROVING_TOKEN) {
        return <ApproveModalContent symbol={trade?.inputAmount?.currency?.symbol} />
      }

      if (confirmModalState === ConfirmModalState.APPROVE_PENDING) {
        return (
          <ApprovePendingModalContent
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
      return <ConfirmationPendingContent pendingText={pendingText} />
    }

    if (confirmModalState === ConfirmModalState.PENDING_CONFIRMATION && txHash) {
      return (
        <TransactionSubmittedContent
          hash={txHash}
          chainId={chainId}
          currencyToAdd={trade?.outputAmount?.currency}
          onDismiss={handleDismiss}
        />
      )
    }

    if (confirmModalState === ConfirmModalState.COMPLETED) {
      return <>Completed</>
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
    allowedSlippage,
    attemptingTxn,
    chainId,
    confirmModalState,
    currencyBalances,
    handleDismiss,
    onAcceptChanges,
    openSettingModal,
    originalTrade,
    pendingText,
    recipient,
    showApproveFlow,
    startSwapFlow,
    swapErrorMessage,
    trade,
    txHash,
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
