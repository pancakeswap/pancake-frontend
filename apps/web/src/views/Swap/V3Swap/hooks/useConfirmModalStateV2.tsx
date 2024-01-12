import { CurrencyAmount, Token } from '@pancakeswap/swap-sdk-core'
import { ConfirmModalState } from '@pancakeswap/widgets-internal'
import { usePermit, usePermitRequirements } from 'hooks/usePermitStatus'
import { useCallback, useState } from 'react'
import { isUserRejected } from 'utils/sentry'
import { Address, UserRejectedRequestError } from 'viem'
import { PendingConfirmModalState } from '../types'
import { TransactionRejectedError } from './useSendSwapTransaction'

export const useConfirmModalStateV2 = (
  amount: CurrencyAmount<Token> | undefined,
  spender?: Address,
  onConfirm?: () => void,
) => {
  const [confirmModalState, setConfirmModalState] = useState<ConfirmModalState>(ConfirmModalState.REVIEWING)
  const [pendingModalSteps, setPendingModalSteps] = useState<PendingConfirmModalState[]>([])
  const [swapErrorMessage, setSwapErrorMessage] = useState<string | undefined>(undefined)
  const { requireApprove, requireRevoke, requirePermit } = usePermitRequirements(amount, spender)
  const { execute } = usePermit(amount, spender, onConfirm)

  const resetConfirmModalState = useCallback(() => {
    console.debug('debug resetConfirmModalState')
    setConfirmModalState(ConfirmModalState.REVIEWING)
    setSwapErrorMessage(undefined)
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
    try {
      const hasStart = confirmModalState !== ConfirmModalState.REVIEWING
      if (!hasStart) {
        setConfirmModalState(pendingModalSteps[0])
      } else {
        const currentStep = pendingModalSteps.findIndex((step) => step === confirmModalState)
        const nextStep = pendingModalSteps[currentStep + 1]

        setConfirmModalState(nextStep ?? ConfirmModalState.PENDING_CONFIRMATION)
      }

      await execute()
    } catch (error: any) {
      console.debug('debug performStep', error)
      if (
        error instanceof UserRejectedRequestError ||
        error instanceof TransactionRejectedError ||
        isUserRejected(error)
      ) {
        console.debug('debug performStep', 'UserRejectedRequestError')
        resetConfirmModalState()
      } else {
        console.error(error)
        setSwapErrorMessage(typeof error === 'string' ? error : error?.message)
        throw error
      }
    }
  }, [confirmModalState, execute, pendingModalSteps, resetConfirmModalState])

  const startSwap = useCallback(() => {
    const steps = generateRequiredSteps()
    setPendingModalSteps(steps)
    console.debug(
      'debug steps',
      steps.map((step) => ConfirmModalState[step]),
    )
    performStep()
  }, [generateRequiredSteps, performStep])

  return {
    confirmModalState,
    pendingModalSteps,
    resetConfirmModalState,
    startSwap,
    swapErrorMessage,
  }
}
