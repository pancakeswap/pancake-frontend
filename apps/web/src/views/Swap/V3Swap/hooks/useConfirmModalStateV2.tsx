import { Currency, CurrencyAmount, Token } from '@pancakeswap/swap-sdk-core'
import { Permit2Signature } from '@pancakeswap/universal-router-sdk'
import { ConfirmModalState } from '@pancakeswap/widgets-internal'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ApprovalState } from 'hooks/useApproveCallback'
import { usePermitRequirements } from 'hooks/usePermitStatus'
import { useCallback, useEffect, useRef, useState } from 'react'
import { isUserRejected } from 'utils/sentry'
import { Address, Hex, UserRejectedRequestError } from 'viem'
import usePrevious from 'views/V3Info/hooks/usePrevious'
import { usePublicClient } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'
import { PendingConfirmModalState } from '../types'
import { TransactionRejectedError } from './useSendSwapTransaction'

export const useConfirmModalStateV2 = (
  onStep: () => Promise<SendTransactionResult | undefined>,
  amount: CurrencyAmount<Currency> | undefined,
  approvalState: ApprovalState,
  permit2Signature: Permit2Signature | undefined,
  spender?: Address,
) => {
  const { chainId } = useActiveChainId()
  const provider = usePublicClient({ chainId })
  const [confirmModalState, setConfirmModalState] = useState<ConfirmModalState>(ConfirmModalState.REVIEWING)
  const pendingModalSteps = useRef<PendingConfirmModalState[]>([])
  const [txHash, setTxHash] = useState<Hex | undefined>(undefined)
  const [swapErrorMessage, setSwapErrorMessage] = useState<string | undefined>(undefined)
  const { requireApprove, requireRevoke, requirePermit } = usePermitRequirements(
    amount?.currency.isToken ? (amount as CurrencyAmount<Token>) : undefined,
    spender,
  )
  const prevApprovalState = usePrevious(approvalState)

  const resetConfirmModalState = useCallback(() => {
    setConfirmModalState(ConfirmModalState.REVIEWING)
    setSwapErrorMessage(undefined)
    setTxHash(undefined)
  }, [])

  const generateRequiredSteps = useCallback(() => {
    const steps: PendingConfirmModalState[] = []
    if (requireRevoke) {
      steps.push(ConfirmModalState.RESETTING_APPROVAL)
    }
    if (requireApprove) {
      steps.push(ConfirmModalState.APPROVING_TOKEN)
    }
    if (requirePermit) {
      steps.push(ConfirmModalState.PERMITTING)
    }
    // steps.push(ConfirmModalState.PENDING_CONFIRMATION)
    return steps
  }, [requireApprove, requireRevoke, requirePermit])

  const updateStep = useCallback(() => {
    const isFinalStep = confirmModalState === ConfirmModalState.PENDING_CONFIRMATION
    const steps = pendingModalSteps.current
    if (!isFinalStep) {
      const finalStep = ConfirmModalState.PENDING_CONFIRMATION
      const inProgressStep = steps.findIndex((step) => step === confirmModalState)
      const nextStep = (inProgressStep > -1 ? steps[inProgressStep + 1] : steps[0]) ?? finalStep
      setConfirmModalState(nextStep)
    }
  }, [confirmModalState])
  const performStep = useCallback(async () => {
    try {
      setTxHash(undefined)
      updateStep()
      const result = await onStep()
      if (result && result.hash) {
        setTxHash(result.hash)
      }
    } catch (error: any) {
      console.error(error)
      if (
        error instanceof UserRejectedRequestError ||
        error instanceof TransactionRejectedError ||
        (typeof error !== 'string' && isUserRejected(error))
      ) {
        resetConfirmModalState()
      } else {
        setSwapErrorMessage(typeof error === 'string' ? error : error?.message)
        throw error
      }
    }
  }, [onStep, resetConfirmModalState, updateStep])

  const startSwap = () => {
    const steps = generateRequiredSteps()
    pendingModalSteps.current = steps
    performStep()
  }

  const checkHashIsReceipted = useCallback(
    async (hash: Hex) => {
      const receipt: any = await provider.waitForTransactionReceipt({ hash })
      if (receipt.status === 'success') {
        if (ConfirmModalState.PENDING_CONFIRMATION === confirmModalState) {
          setConfirmModalState(ConfirmModalState.COMPLETED)
        }
        if (ConfirmModalState.APPROVING_TOKEN === confirmModalState) {
          setConfirmModalState(ConfirmModalState.PERMITTING)
          performStep()
        }
      }
    },
    [provider, confirmModalState, performStep],
  )

  // swap confirmed
  useEffect(() => {
    if (txHash && confirmModalState === ConfirmModalState.PENDING_CONFIRMATION) {
      checkHashIsReceipted(txHash)
    }
  }, [checkHashIsReceipted, confirmModalState, txHash])

  // approve
  useEffect(() => {
    // allowance approved
    if (prevApprovalState === ApprovalState.PENDING && approvalState === ApprovalState.APPROVED) {
      if (txHash) {
        checkHashIsReceipted(txHash)
      } else {
        performStep()
      }
    }
    // allowance approved but the amount not enough
    if (prevApprovalState === ApprovalState.PENDING && approvalState === ApprovalState.NOT_APPROVED) {
      resetConfirmModalState()
    }
  }, [prevApprovalState, approvalState, performStep, resetConfirmModalState, txHash, checkHashIsReceipted])

  // permit
  useEffect(() => {
    if (permit2Signature && confirmModalState === ConfirmModalState.PERMITTING) {
      performStep()
    }
  }, [confirmModalState, permit2Signature, performStep])

  return {
    confirmModalState,
    pendingModalSteps: pendingModalSteps.current,
    resetConfirmModalState,
    startSwap,
    swapErrorMessage,
  }
}
