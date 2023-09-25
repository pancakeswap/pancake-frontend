import { usePublicClient } from 'wagmi'
import { useCallback, useEffect, useState } from 'react'
import { ConfirmModalState, PendingConfirmModalState } from 'views/Swap/V3Swap/types'
import { ApprovalState } from 'hooks/useApproveCallback'
import { ethereumTokens } from '@pancakeswap/tokens'
import { Currency, CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import { SendTransactionResult } from 'wagmi/actions'
import { ChainId } from '@pancakeswap/sdk'
import { Allowance, AllowanceState } from 'hooks/usePermit2Allowance'
import usePrevious from 'views/V3Info/hooks/usePrevious'

interface UseConfirmModalStateProps {
  txHash: string
  chainId: ChainId
  approval: ApprovalState
  approvalToken: Currency
  isPendingError: boolean
  currentAllowance: CurrencyAmount<Currency>
  onConfirm: () => void
  approveCallback: () => Promise<SendTransactionResult>
  revokeCallback: () => Promise<SendTransactionResult>
  allowance: Allowance
}

function isInApprovalPhase(confirmModalState: ConfirmModalState) {
  return (
    confirmModalState === ConfirmModalState.APPROVING_TOKEN || confirmModalState === ConfirmModalState.APPROVE_PENDING || confirmModalState === ConfirmModalState.PERMITTING
  )
}

export const useConfirmModalState = ({
  chainId,
  txHash,
  approval,
  approvalToken,
  isPendingError,
  currentAllowance,
  onConfirm,
  approveCallback,
  revokeCallback,
  allowance,
}: UseConfirmModalStateProps) => {
  const provider = usePublicClient({ chainId })
  const [confirmModalState, setConfirmModalState] = useState<ConfirmModalState>(ConfirmModalState.REVIEWING)
  const [pendingModalSteps, setPendingModalSteps] = useState<PendingConfirmModalState[]>([])
  const [previouslyPending, setPreviouslyPending] = useState<boolean>(false)
  const [resettingApproval, setResettingApproval] = useState<boolean>(false)

  const generateRequiredSteps = useCallback(() => {
    const steps: PendingConfirmModalState[] = []
    // Any existing USDT allowance needs to be reset before we can approve the new amount (mainnet only).
    // See the `approve` function here: https://etherscan.io/address/0xdAC17F958D2ee523a2206206994597C13D831ec7#code
    if (
      allowance?.state === AllowanceState.REQUIRED &&
      allowance?.needsSetupApproval &&
      currentAllowance?.greaterThan(0) &&
      approvalToken.chainId === ethereumTokens.usdt.chainId &&
      approvalToken.wrapped.address.toLowerCase() === ethereumTokens.usdt.address.toLowerCase()
    ) {
      steps.push(ConfirmModalState.RESETTING_APPROVAL)
    }
    if (allowance?.state === AllowanceState.REQUIRED && allowance.needsSetupApproval) {
      steps.push(ConfirmModalState.APPROVING_TOKEN)
    }
    if (allowance?.state === AllowanceState.REQUIRED && allowance.needsPermitSignature) {
      steps.push(ConfirmModalState.PERMITTING)
    }
    steps.push(ConfirmModalState.PENDING_CONFIRMATION)
    return steps
  }, [allowance, approvalToken?.chainId, approvalToken?.wrapped.address, currentAllowance])

  const performStep = useCallback(
    async (step: ConfirmModalState) => {
      switch (step) {
        case ConfirmModalState.RESETTING_APPROVAL:
          setConfirmModalState(ConfirmModalState.RESETTING_APPROVAL)
          allowance.revoke().catch(() => onCancel())
          break
        case ConfirmModalState.APPROVING_TOKEN:
          setConfirmModalState(ConfirmModalState.APPROVING_TOKEN)
          allowance.approve().catch(() => onCancel())
          break
        case ConfirmModalState.PERMITTING:
          setConfirmModalState(ConfirmModalState.PERMITTING)
          allowance.permit().catch(() => onCancel())
          break
        case ConfirmModalState.PENDING_CONFIRMATION:
          setConfirmModalState(ConfirmModalState.PENDING_CONFIRMATION)
          try {
            onConfirm()
          } catch (e) {
            onCancel()
          }
          break
        default:
          setConfirmModalState(ConfirmModalState.REVIEWING)
          break
      }
    },[allowance, onConfirm]
  )

  const resetSwapFlow = useCallback(() => {
    setConfirmModalState(ConfirmModalState.REVIEWING)
    setPendingModalSteps([])
    setPreviouslyPending(false)
    setResettingApproval(false)
  }, [])

  const startSwapFlow = useCallback(() => {
    const steps = generateRequiredSteps()
    console.log(steps)
    setPendingModalSteps(steps)
    performStep(steps[0])
  }, [generateRequiredSteps, performStep])

  const onCancel = () => {
    setConfirmModalState(ConfirmModalState.REVIEWING)
    setPreviouslyPending(false)
  }

  const checkHashIsReceipted = useCallback(
    async (hash) => {
      const receipt: any = await provider.waitForTransactionReceipt({ hash })
      if (receipt.status === 'success') {
        performStep(ConfirmModalState.COMPLETED)
      }
    },
    [performStep, provider],
  )

  const previousSetupApprovalNeeded = usePrevious(
    allowance?.state === AllowanceState.REQUIRED ? allowance?.needsSetupApproval : undefined
  )

  // useEffect(() => {
  //   // If the wrapping step finished, trigger the next step (allowance or swap).
  //   if (wrapConfirmed && !prevWrapConfirmed) {
  //     // moves on to either approve WETH or to swap submission
  //     performStep(pendingModalSteps[1])
  //   }
  // }, [pendingModalSteps, performStep, prevWrapConfirmed, wrapConfirmed])

  useEffect(() => {
    if (
      allowance?.state === AllowanceState.REQUIRED &&
      allowance?.needsPermitSignature &&
      // If the token approval switched from missing to fulfilled, trigger the next step (permit2 signature).
      !allowance?.needsSetupApproval &&
      previousSetupApprovalNeeded
    ) {
      performStep(ConfirmModalState.PERMITTING)
    }
  }, [allowance, performStep, previousSetupApprovalNeeded])

  const previousRevocationPending = usePrevious(
    allowance?.state === AllowanceState.REQUIRED && allowance.isRevocationPending
  )
  useEffect(() => {
    if (allowance?.state === AllowanceState.REQUIRED && previousRevocationPending && !allowance.isRevocationPending) {
      performStep(ConfirmModalState.APPROVING_TOKEN)
    }
  }, [allowance, performStep, previousRevocationPending])

  useEffect(() => {
    // Automatically triggers the next phase if the local modal state still thinks we're in the approval phase,
    // but the allowance has been set. This will automaticaly trigger the swap.
    if (isInApprovalPhase(confirmModalState) && allowance.state === AllowanceState.ALLOWED) {
      performStep(ConfirmModalState.PENDING_CONFIRMATION)
    }
  }, [allowance, confirmModalState, performStep])

  useEffect(() => {
    if (txHash && confirmModalState === ConfirmModalState.PENDING_CONFIRMATION && approval === ApprovalState.APPROVED) {
      checkHashIsReceipted(txHash)
    }
  }, [approval, txHash, confirmModalState, checkHashIsReceipted, performStep])

  return { confirmModalState, pendingModalSteps, startSwapFlow, onCancel, resetSwapFlow }
}
