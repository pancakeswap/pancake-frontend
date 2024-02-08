import { ChainId } from '@pancakeswap/chains'
import { Currency, CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import { ethereumTokens } from '@pancakeswap/tokens'
import { ApprovalState } from 'hooks/useApproveCallback'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { useCallback, useEffect, useState } from 'react'
import { ConfirmModalStateV1, PendingConfirmModalStateV1 } from 'views/Swap/V3Swap/types'
import { SendTransactionResult } from 'wagmi/actions'
import { TransactionRejectedError } from './useSendSwapTransaction'

interface UseConfirmModalStateProps {
  txHash?: string
  chainId?: ChainId
  approval: ApprovalState
  approvalToken?: Currency
  isPendingError: boolean
  isExpertMode: boolean
  currentAllowance?: CurrencyAmount<Currency>
  onConfirm: () => Promise<void>
  approveCallback: () => Promise<SendTransactionResult | undefined>
  revokeCallback: () => Promise<SendTransactionResult | undefined>
}

function isInApprovalPhase(confirmModalState: ConfirmModalStateV1) {
  return (
    confirmModalState === ConfirmModalStateV1.APPROVING_TOKEN ||
    confirmModalState === ConfirmModalStateV1.APPROVE_PENDING
  )
}
export const useConfirmModalStateV1 = ({
  chainId,
  txHash,
  approval,
  approvalToken,
  isPendingError,
  currentAllowance,
  onConfirm,
  approveCallback,
  revokeCallback,
}: UseConfirmModalStateProps) => {
  const { waitForTransaction } = usePublicNodeWaitForTransaction()
  const [confirmModalState, setConfirmModalState] = useState<ConfirmModalStateV1>(ConfirmModalStateV1.REVIEWING)
  const [pendingModalSteps, setPendingModalSteps] = useState<PendingConfirmModalStateV1[]>([])
  const [previouslyPending, setPreviouslyPending] = useState<boolean>(false)
  const [resettingApproval, setResettingApproval] = useState<boolean>(false)

  const generateRequiredSteps = useCallback(() => {
    const steps: PendingConfirmModalStateV1[] = []

    // Any existing USDT allowance needs to be reset before we can approve the new amount (mainnet only).
    // See the `approve` function here: https://etherscan.io/address/0xdAC17F958D2ee523a2206206994597C13D831ec7#code
    if (
      approval === ApprovalState.NOT_APPROVED &&
      currentAllowance?.greaterThan(0) &&
      approvalToken &&
      approvalToken.chainId === ethereumTokens.usdt.chainId &&
      approvalToken.wrapped.address.toLowerCase() === ethereumTokens.usdt.address.toLowerCase()
    ) {
      steps.push(ConfirmModalStateV1.RESETTING_APPROVAL)
    }

    if (approval === ApprovalState.NOT_APPROVED) {
      setPreviouslyPending(false)
      steps.push(ConfirmModalStateV1.APPROVING_TOKEN, ConfirmModalStateV1.APPROVE_PENDING)
    }

    steps.push(ConfirmModalStateV1.PENDING_CONFIRMATION)
    return steps
  }, [approval, approvalToken, currentAllowance])

  const onCancel = useCallback(() => {
    setConfirmModalState(ConfirmModalStateV1.REVIEWING)
    setPreviouslyPending(false)
  }, [])

  const resetSwapFlow = useCallback(() => {
    setConfirmModalState(ConfirmModalStateV1.REVIEWING)
    setPendingModalSteps([])
    setPreviouslyPending(false)
    setResettingApproval(false)
  }, [])

  const performStep = useCallback(
    async (step: ConfirmModalStateV1) => {
      switch (step) {
        case ConfirmModalStateV1.RESETTING_APPROVAL:
          setConfirmModalState(ConfirmModalStateV1.RESETTING_APPROVAL)
          revokeCallback()
            .then(() => setResettingApproval(true))
            .catch(() => onCancel())
          break
        case ConfirmModalStateV1.APPROVING_TOKEN:
          setConfirmModalState(ConfirmModalStateV1.APPROVING_TOKEN)
          approveCallback()
            .then(() => setConfirmModalState(ConfirmModalStateV1.APPROVE_PENDING))
            .catch(() => onCancel())
          break
        case ConfirmModalStateV1.PENDING_CONFIRMATION:
          setConfirmModalState(ConfirmModalStateV1.PENDING_CONFIRMATION)
          try {
            await onConfirm()
          } catch (error) {
            if (error instanceof TransactionRejectedError) {
              resetSwapFlow()
            }
          }
          break
        case ConfirmModalStateV1.COMPLETED:
          setConfirmModalState(ConfirmModalStateV1.COMPLETED)
          break
        default:
          setConfirmModalState(ConfirmModalStateV1.REVIEWING)
          break
      }
    },
    [approveCallback, revokeCallback, onConfirm, onCancel, resetSwapFlow],
  )

  const startSwapFlow = useCallback(() => {
    const steps = generateRequiredSteps()
    setPendingModalSteps(steps)
    performStep(steps[0])
  }, [generateRequiredSteps, performStep])

  const checkHashIsReceipted = useCallback(
    async (hash) => {
      const receipt: any = await waitForTransaction({ hash, chainId })
      if (receipt.status === 'success') {
        performStep(ConfirmModalStateV1.COMPLETED)
      }
    },
    [performStep, waitForTransaction, chainId],
  )

  useEffect(() => {
    if (approval === ApprovalState.NOT_APPROVED && resettingApproval) {
      startSwapFlow()
      setResettingApproval(false)
    }
  }, [approval, resettingApproval, performStep, startSwapFlow])

  useEffect(() => {
    if (approval === ApprovalState.PENDING && confirmModalState === ConfirmModalStateV1.APPROVE_PENDING) {
      setPreviouslyPending(true)
    }
  }, [approval, confirmModalState])

  // Submit Approve but after submit find out still not enough.
  useEffect(() => {
    if (
      previouslyPending &&
      approval === ApprovalState.NOT_APPROVED &&
      confirmModalState === ConfirmModalStateV1.APPROVE_PENDING
    ) {
      onCancel()
    }
  }, [approval, confirmModalState, previouslyPending, onCancel])

  // Submit Approve, get error when submit approve.
  useEffect(() => {
    if (isPendingError && confirmModalState === ConfirmModalStateV1.APPROVE_PENDING) {
      onCancel()
    }
  }, [isPendingError, confirmModalState, previouslyPending, onCancel])

  useEffect(() => {
    if (isInApprovalPhase(confirmModalState) && approval === ApprovalState.APPROVED) {
      performStep(ConfirmModalStateV1.PENDING_CONFIRMATION)
    }
  }, [approval, confirmModalState, performStep])

  useEffect(() => {
    if (
      txHash &&
      confirmModalState === ConfirmModalStateV1.PENDING_CONFIRMATION &&
      approval === ApprovalState.APPROVED
    ) {
      checkHashIsReceipted(txHash)
    }
  }, [approval, txHash, confirmModalState, checkHashIsReceipted, performStep])

  return { confirmModalState, pendingModalSteps, startSwapFlow, resetSwapFlow }
}
