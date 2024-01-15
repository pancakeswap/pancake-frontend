import { Currency, CurrencyAmount, Token } from '@pancakeswap/swap-sdk-core'
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
    console.debug('debug resetConfirmModalState')
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
    steps.push(ConfirmModalState.PENDING_CONFIRMATION)
    return steps
  }, [requireApprove, requireRevoke, requirePermit])

  const performStep = useCallback(async () => {
    console.debug('debug performStep', 'confirmModalState', ConfirmModalState[confirmModalState], { confirmModalState })
    console.debug(
      'debug performStep',
      'pendingModalSteps',
      pendingModalSteps.current.map((step) => ConfirmModalState[step]),
    )
    const steps = pendingModalSteps.current
    try {
      // refactor: create new callback to set state tp next step
      const isLastStep = confirmModalState === ConfirmModalState.PENDING_CONFIRMATION
      if (!isLastStep) {
        const hasStart = confirmModalState !== ConfirmModalState.REVIEWING
        console.debug('debug performStep', 'currentStep', { currentStep: ConfirmModalState[confirmModalState] })
        if (!hasStart) {
          console.debug('debug performStep', 'nextStep', { nextStep: ConfirmModalState[steps[0]] })
          setConfirmModalState(steps[0] ?? ConfirmModalState.PENDING_CONFIRMATION)
        } else {
          const currentStep = steps.findIndex((step) => step === confirmModalState)
          const nextStep = steps[currentStep + 1]
          console.debug('debug performStep', 'nextStep', { nextStep: ConfirmModalState[nextStep] })

          setConfirmModalState(nextStep ?? ConfirmModalState.PENDING_CONFIRMATION)
        }
      }

      const result = await onStep()
      if (result && result.hash) {
        setTxHash(result.hash)
      }
    } catch (error: any) {
      console.debug('debug performStep', error)
      console.error(error)
      if (
        error instanceof UserRejectedRequestError ||
        error instanceof TransactionRejectedError ||
        (typeof error !== 'string' && isUserRejected(error))
      ) {
        console.debug('debug performStep', 'UserRejectedRequestError')
        resetConfirmModalState()
      } else {
        setSwapErrorMessage(typeof error === 'string' ? error : error?.message)
        throw error
      }
    }
  }, [confirmModalState, onStep, resetConfirmModalState])

  const startSwap = () => {
    const steps = generateRequiredSteps()
    pendingModalSteps.current = steps
    console.debug(
      'debug steps',
      steps.map((step) => ConfirmModalState[step]),
    )
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
      performStep()
    }
    // allowance approved but the amount not enough
    if (prevApprovalState === ApprovalState.PENDING && approvalState === ApprovalState.NOT_APPROVED) {
      resetConfirmModalState()
    }
  }, [prevApprovalState, approvalState, performStep, resetConfirmModalState])

  return {
    confirmModalState,
    pendingModalSteps: pendingModalSteps.current,
    resetConfirmModalState,
    startSwap,
    swapErrorMessage,
  }
}
