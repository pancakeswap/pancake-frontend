import { Currency, CurrencyAmount, Token } from '@pancakeswap/swap-sdk-core'
import { ConfirmModalState } from '@pancakeswap/widgets-internal'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { usePermitRequirements } from 'hooks/usePermitStatus'
import { useCallback, useEffect, useState } from 'react'
import { isUserRejected } from 'utils/sentry'
import { Address, UserRejectedRequestError } from 'viem'
import { usePublicClient } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'
import { PendingConfirmModalState } from '../types'
import { TransactionRejectedError } from './useSendSwapTransaction'

export const useConfirmModalStateV2 = (
  onStep: () => Promise<SendTransactionResult | undefined>,
  amount: CurrencyAmount<Currency> | undefined,
  spender?: Address,
) => {
  const { chainId } = useActiveChainId()
  const provider = usePublicClient({ chainId })
  const [confirmModalState, setConfirmModalState] = useState<ConfirmModalState>(ConfirmModalState.REVIEWING)
  const [pendingModalSteps, setPendingModalSteps] = useState<PendingConfirmModalState[]>([])
  const [txHash, setTxHash] = useState<string | undefined>(undefined)
  const [swapErrorMessage, setSwapErrorMessage] = useState<string | undefined>(undefined)
  const { requireApprove, requireRevoke, requirePermit } = usePermitRequirements(
    amount?.currency.isToken ? (amount as CurrencyAmount<Token>) : undefined,
    spender,
  )

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
    try {
      const isLastStep = confirmModalState === ConfirmModalState.PENDING_CONFIRMATION
      if (!isLastStep) {
        const hasStart = confirmModalState !== ConfirmModalState.REVIEWING
        console.debug('debug performStep', 'currentStep', { currentStep: ConfirmModalState[confirmModalState] })
        if (!hasStart) {
          console.debug('debug performStep', 'nextStep', { nextStep: ConfirmModalState[pendingModalSteps[0]] })
          setConfirmModalState(pendingModalSteps[0] ?? ConfirmModalState.PENDING_CONFIRMATION)
        } else {
          const currentStep = pendingModalSteps.findIndex((step) => step === confirmModalState)
          const nextStep = pendingModalSteps[currentStep + 1]
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
  }, [confirmModalState, onStep, pendingModalSteps, resetConfirmModalState])

  const startSwap = useCallback(() => {
    const steps = generateRequiredSteps()
    setPendingModalSteps(steps)
    console.debug(
      'debug steps',
      steps.map((step) => ConfirmModalState[step]),
    )
    performStep()
  }, [generateRequiredSteps, performStep])

  const checkHashIsReceipted = useCallback(
    async (hash) => {
      const receipt: any = await provider.waitForTransactionReceipt({ hash })
      if (receipt.status === 'success') {
        setConfirmModalState(ConfirmModalState.COMPLETED)
      }
    },
    [setConfirmModalState, provider],
  )

  useEffect(() => {
    if (txHash && confirmModalState === ConfirmModalState.PENDING_CONFIRMATION) {
      checkHashIsReceipted(txHash)
    }
  }, [checkHashIsReceipted, confirmModalState, txHash])

  return {
    confirmModalState,
    pendingModalSteps,
    resetConfirmModalState,
    startSwap,
    swapErrorMessage,
  }
}
