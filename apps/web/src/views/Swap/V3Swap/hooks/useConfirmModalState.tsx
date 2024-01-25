import { useTranslation } from '@pancakeswap/localization'
import { SmartRouterTrade } from '@pancakeswap/smart-router'
import { Currency, CurrencyAmount, Token, TradeType } from '@pancakeswap/swap-sdk-core'
import { Permit2Signature } from '@pancakeswap/universal-router-sdk'
import { ConfirmModalState } from '@pancakeswap/widgets-internal'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ApprovalState } from 'hooks/useApproveCallback'
import { useAllowanceRequirements } from 'hooks/usePermitStatus'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { isUserRejected } from 'utils/sentry'
import { Address, Hex, UserRejectedRequestError } from 'viem'
import usePrevious from 'views/V3Info/hooks/usePrevious'
import { usePublicClient } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'
import { AllowedAllowanceState, PendingConfirmModalState } from '../types'
import { TransactionRejectedError } from './useSendSwapTransaction'

export const useApprovalPhaseStepTitles: ({ trade }: { trade: SmartRouterTrade<TradeType> | undefined }) => {
  [step in AllowedAllowanceState]: string
} = ({ trade }: { trade: SmartRouterTrade<TradeType> | undefined }) => {
  const { t } = useTranslation()
  return useMemo(() => {
    return {
      [ConfirmModalState.RESETTING_APPROVAL]: t('Reset approval on USDT.'),
      [ConfirmModalState.APPROVING_TOKEN]: t('Approve %symbol%', {
        symbol: trade ? trade.inputAmount.currency.symbol : '',
      }),
      [ConfirmModalState.PERMITTING]: t('Permit %symbol%', { symbol: trade ? trade.inputAmount.currency.symbol : '' }),
    }
  }, [t, trade])
}

export const useConfirmModalState = (
  onStep: () => Promise<SendTransactionResult | undefined>,
  amount: CurrencyAmount<Currency> | undefined,
  approvalState: ApprovalState,
  permit2Signature: Permit2Signature | undefined,
  setPermit2Signature?: (signature: Permit2Signature | undefined) => void,
  spender?: Address,
) => {
  const { chainId } = useActiveChainId()
  const provider = usePublicClient({ chainId })
  const [confirmModalState, setConfirmModalState] = useState<ConfirmModalState>(ConfirmModalState.REVIEWING)
  const pendingModalSteps = useRef<PendingConfirmModalState[]>([])
  const [txHash, setTxHash] = useState<Hex | undefined>(undefined)
  const [swapErrorMessage, setSwapErrorMessage] = useState<string | undefined>(undefined)

  const approveByPermit2 = useMemo(() => typeof setPermit2Signature === 'function', [setPermit2Signature])
  const { requireApprove, requireRevoke, requirePermit } = useAllowanceRequirements(
    approveByPermit2,
    amount?.currency.isToken ? (amount as CurrencyAmount<Token>) : undefined,
    spender,
  )
  const requirePermit2 = useMemo(() => {
    return requirePermit && approveByPermit2
  }, [requirePermit, approveByPermit2])
  const prevApprovalState = usePrevious(approvalState)

  const resetConfirmModalState = useCallback(() => {
    setConfirmModalState(ConfirmModalState.REVIEWING)
    setSwapErrorMessage(undefined)
    setTxHash(undefined)
    setPermit2Signature?.(undefined)
  }, [setPermit2Signature])

  const generateRequiredSteps = useCallback(() => {
    // console.debug('debug: generateRequiredSteps', { requireApprove, requireRevoke, requirePermit2 })
    const steps: PendingConfirmModalState[] = []
    if (requireRevoke) {
      steps.push(ConfirmModalState.RESETTING_APPROVAL)
    }
    if (requireApprove) {
      steps.push(ConfirmModalState.APPROVING_TOKEN)
    }
    if (requirePermit2) {
      steps.push(ConfirmModalState.PERMITTING)
    }
    steps.push(ConfirmModalState.PENDING_CONFIRMATION)
    return steps
  }, [requireApprove, requireRevoke, requirePermit2])

  const updateStep = useCallback(() => {
    const steps = pendingModalSteps.current
    // console.debug(
    //   'debug: updateStep steps',
    //   steps.map((step) => ConfirmModalState[step]),
    // )
    // console.debug('debug: updateStep current', ConfirmModalState[confirmModalState])
    const isFinalStep = confirmModalState === ConfirmModalState.PENDING_CONFIRMATION
    if (!isFinalStep) {
      const finalStep = ConfirmModalState.PENDING_CONFIRMATION
      const inProgressStep = steps.findIndex((step) => step === confirmModalState)
      const nextStep = (inProgressStep > -1 ? steps[inProgressStep + 1] : steps[0]) ?? finalStep
      // console.debug('debug: updateStep next', ConfirmModalState[nextStep])
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
        // throw error
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
        if (ConfirmModalState.RESETTING_APPROVAL === confirmModalState) {
          setConfirmModalState(ConfirmModalState.APPROVING_TOKEN)
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
    const allowanceUpdate = prevApprovalState === ApprovalState.PENDING && approvalState === ApprovalState.APPROVED
    const allowanceResetUpdate =
      prevApprovalState === ApprovalState.PENDING &&
      approvalState === ApprovalState.NOT_APPROVED &&
      confirmModalState === ConfirmModalState.RESETTING_APPROVAL
    const allowanceNotEnoughUpdate =
      prevApprovalState === ApprovalState.PENDING &&
      approvalState === ApprovalState.NOT_APPROVED &&
      confirmModalState === ConfirmModalState.APPROVING_TOKEN

    // console.debug('debug: useEffect approvalState', {
    //   confirmModalState: ConfirmModalState[confirmModalState],
    //   prevApprovalState: ApprovalState[prevApprovalState!],
    //   approvalState: ApprovalState[approvalState],
    //   allowanceUpdate,
    //   allowanceResetUpdate,
    //   allowanceNotEnoughUpdate,
    //   txHash,
    // })

    if (allowanceUpdate || allowanceResetUpdate) {
      if (txHash) {
        checkHashIsReceipted(txHash)
      }
    } else if (
      // allowance approved but the amount not enough
      allowanceNotEnoughUpdate
    ) {
      resetConfirmModalState()
    }
  }, [
    prevApprovalState,
    approvalState,
    performStep,
    resetConfirmModalState,
    txHash,
    checkHashIsReceipted,
    confirmModalState,
  ])

  // permit
  useEffect(() => {
    // console.debug('debug: useEffect permit2Signature', {
    //   permit2Signature,
    //   confirmModalState: ConfirmModalState[confirmModalState],
    // })
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
