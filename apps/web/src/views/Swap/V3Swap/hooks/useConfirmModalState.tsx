import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/swap-sdk-core'
import { ethereumTokens } from '@pancakeswap/tokens'
import { ApprovalState } from 'hooks/useApproveCallback'
import { Allowance, AllowanceRequired, AllowanceState } from 'hooks/usePermit2Allowance'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AllowedAllowanceState, ConfirmModalState, PendingConfirmModalState } from 'views/Swap/V3Swap/types'
import usePrevious from 'views/V3Info/hooks/usePrevious'
import { TransactionRejectedError } from './useSendSwapTransaction'

interface UseConfirmModalStateProps {
  txHash?: string
  chainId?: ChainId
  approval: ApprovalState
  approvalToken: Currency | undefined
  currentAllowance: CurrencyAmount<Currency> | undefined
  onConfirm: () => Promise<string | undefined>
  allowance: Allowance
  isPendingError?: boolean
  isExpertMode: boolean
}

export function isInApprovalPhase(confirmModalState: ConfirmModalState) {
  return (
    confirmModalState === ConfirmModalState.APPROVING_TOKEN ||
    confirmModalState === ConfirmModalState.PERMITTING ||
    confirmModalState === ConfirmModalState.RESETTING_APPROVAL
  )
}

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

export const useConfirmModalState = ({
  chainId,
  txHash,
  approval,
  approvalToken,
  currentAllowance,
  onConfirm,
  allowance,
}: UseConfirmModalStateProps) => {
  const { waitForTransaction } = usePublicNodeWaitForTransaction()
  const [confirmModalState, setConfirmModalState] = useState<ConfirmModalState>(ConfirmModalState.REVIEWING)
  const [pendingModalSteps, setPendingModalSteps] = useState<PendingConfirmModalState[]>([])

  const generateRequiredSteps = useCallback(() => {
    const steps: PendingConfirmModalState[] = []
    // Any existing USDT allowance needs to be reset before we can approve the new amount (mainnet only).
    // See the `approve` function here: https://etherscan.io/address/0xdAC17F958D2ee523a2206206994597C13D831ec7#code
    if (
      approvalToken &&
      allowance.state === AllowanceState.REQUIRED &&
      allowance.needsSetupApproval &&
      currentAllowance?.greaterThan(0) &&
      approvalToken &&
      approvalToken.chainId === ethereumTokens.usdt.chainId &&
      approvalToken.wrapped.address.toLowerCase() === ethereumTokens.usdt.address.toLowerCase()
    ) {
      steps.push(ConfirmModalState.RESETTING_APPROVAL)
    }
    if (allowance.state === AllowanceState.REQUIRED && allowance.needsSetupApproval) {
      steps.push(ConfirmModalState.APPROVING_TOKEN)
    }
    if (allowance.state === AllowanceState.REQUIRED && allowance.needsPermitSignature) {
      steps.push(ConfirmModalState.PERMITTING)
    }
    steps.push(ConfirmModalState.PENDING_CONFIRMATION)
    return steps
  }, [allowance, currentAllowance, approvalToken])

  const onCancel = useCallback(() => {
    setConfirmModalState(ConfirmModalState.REVIEWING)
  }, [])

  const resetSwapFlow = useCallback(() => {
    setConfirmModalState(ConfirmModalState.REVIEWING)
    setPendingModalSteps([])
  }, [])

  const performStep = useCallback(
    async (step: ConfirmModalState) => {
      const permitAllowance = allowance as AllowanceRequired
      switch (step) {
        case ConfirmModalState.RESETTING_APPROVAL:
          setConfirmModalState(ConfirmModalState.RESETTING_APPROVAL)
          permitAllowance.revoke().catch(() => onCancel())
          break
        case ConfirmModalState.APPROVING_TOKEN:
          setConfirmModalState(ConfirmModalState.APPROVING_TOKEN)
          permitAllowance.approve().catch(() => onCancel()) as AllowanceRequired
          break
        case ConfirmModalState.PERMITTING:
          setConfirmModalState(ConfirmModalState.PERMITTING)
          permitAllowance.permit().catch(() => onCancel())
          break
        case ConfirmModalState.PENDING_CONFIRMATION:
          setConfirmModalState(ConfirmModalState.PENDING_CONFIRMATION)
          try {
            if (!(await onConfirm())) {
              resetSwapFlow()
            }
          } catch (error) {
            if (error instanceof TransactionRejectedError) {
              resetSwapFlow()
            }
          }
          break
        case ConfirmModalState.COMPLETED:
          setConfirmModalState(ConfirmModalState.COMPLETED)
          break
        default:
          setConfirmModalState(ConfirmModalState.REVIEWING)
          break
      }
    },
    [allowance, onConfirm, onCancel, resetSwapFlow],
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
        performStep(ConfirmModalState.COMPLETED)
      }
    },
    [performStep, waitForTransaction, chainId],
  )

  const previousSetupApprovalNeeded = usePrevious(
    allowance.state === AllowanceState.REQUIRED ? allowance.needsSetupApproval : undefined,
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
      allowance.state === AllowanceState.REQUIRED &&
      allowance.needsPermitSignature &&
      !allowance.needsSetupApproval &&
      previousSetupApprovalNeeded
    ) {
      performStep(ConfirmModalState.PERMITTING)
    }
  }, [allowance, performStep, previousSetupApprovalNeeded])

  const previousRevocationPending = usePrevious(
    allowance.state === AllowanceState.REQUIRED && allowance.isRevocationPending,
  )
  useEffect(() => {
    if (allowance.state === AllowanceState.REQUIRED && previousRevocationPending && !allowance.isRevocationPending) {
      performStep(ConfirmModalState.APPROVING_TOKEN)
    }
  }, [allowance, performStep, previousRevocationPending])

  useEffect(() => {
    if (isInApprovalPhase(confirmModalState) && allowance.state === AllowanceState.ALLOWED) {
      performStep(ConfirmModalState.PENDING_CONFIRMATION)
    }
  }, [allowance, confirmModalState, performStep])

  useEffect(() => {
    if (txHash && confirmModalState === ConfirmModalState.PENDING_CONFIRMATION && approval === ApprovalState.APPROVED) {
      checkHashIsReceipted(txHash)
    }
  }, [approval, txHash, confirmModalState, checkHashIsReceipted, performStep])

  return { confirmModalState, pendingModalSteps, startSwapFlow, onCancel }
}
