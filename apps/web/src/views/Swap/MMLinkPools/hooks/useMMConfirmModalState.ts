import { usePreviousValue } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { SmartRouterTrade, V4Router } from '@pancakeswap/smart-router'
import { Currency, CurrencyAmount, Token, TradeType } from '@pancakeswap/swap-sdk-core'
import { ConfirmModalState } from '@pancakeswap/widgets-internal'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { RetryableError, retry } from 'state/multicall/retry'
import { publicClient } from 'utils/client'
import { UserUnexpectedTxError } from 'utils/errors'
import { Address, Hex, TransactionNotFoundError, TransactionReceipt, TransactionReceiptNotFoundError } from 'viem'
import { ConfirmAction } from 'views/Swap/V3Swap/hooks/useConfirmModalStateV2'
import { userRejectedError } from 'views/Swap/V3Swap/hooks/useSendSwapTransaction'
import { useApprove, useApproveRequires } from './useApprove'
import { MMSwapCall } from './useSwapCallArguments'
import { useSwapCallback } from './useSwapCallback'

const useCreateConfirmSteps = (amountToApprove: CurrencyAmount<Token> | undefined, spender: Address | undefined) => {
  const { requireApprove, requireRevoke } = useApproveRequires(amountToApprove, spender)

  return useCallback(() => {
    const steps: ConfirmModalState[] = []
    if (requireRevoke) {
      steps.push(ConfirmModalState.RESETTING_APPROVAL)
    }
    if (requireApprove) {
      steps.push(ConfirmModalState.APPROVING_TOKEN)
    }
    steps.push(ConfirmModalState.PENDING_CONFIRMATION)
    return steps
  }, [requireApprove, requireRevoke])
}

const useConfirmActions = (
  trade: SmartRouterTrade<TradeType> | V4Router.V4TradeWithoutGraph<TradeType> | undefined,
  swapCalls: MMSwapCall[],
  recipient: Address | null,
  amountToApprove: CurrencyAmount<Token> | undefined,
  spender: Address | undefined,
  expiredAt?: number,
) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const { revoke, approve, refetch } = useApprove(amountToApprove, spender)
  const { callback: swap, error: swapCallbackError } = useSwapCallback(trade, recipient, swapCalls, expiredAt)

  const [confirmState, setConfirmState] = useState<ConfirmModalState>(ConfirmModalState.REVIEWING)
  const [txHash, setTxHash] = useState<Hex | undefined>(undefined)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  const resetState = useCallback(() => {
    setConfirmState(ConfirmModalState.REVIEWING)
    setTxHash(undefined)
    setErrorMessage(undefined)
  }, [])

  const showError = useCallback((error: string) => {
    setErrorMessage(error)
    setTxHash(undefined)
  }, [])

  const retryWaitForTransaction = useCallback(
    async ({ hash }: { hash: Hex | undefined }) => {
      if (hash && chainId) {
        let retryTimes = 0
        const getReceipt = async () => {
          console.info('retryWaitForTransaction', hash, retryTimes++)
          try {
            return await publicClient({ chainId }).waitForTransactionReceipt({ hash })
          } catch (error) {
            if (error instanceof TransactionReceiptNotFoundError || error instanceof TransactionNotFoundError) {
              throw new RetryableError()
            }
            throw error
          }
        }
        const { promise } = retry<TransactionReceipt>(getReceipt, {
          n: 6,
          minWait: 2000,
          maxWait: 5000,
        })
        return promise
      }
      return undefined
    },
    [chainId],
  )

  const revokeStep = useMemo(() => {
    const action = async (nextState?: ConfirmModalState) => {
      setTxHash(undefined)
      setConfirmState(ConfirmModalState.RESETTING_APPROVAL)
      try {
        const result = await revoke()
        if (result?.hash) {
          setTxHash(result.hash)

          await retryWaitForTransaction({ hash: result.hash })
        }

        let newAllowanceRaw: bigint = 0n

        try {
          // check if user really reset the approval to 0
          const { data } = await refetch()
          newAllowanceRaw = data ?? 0n
        } catch (error) {
          // assume the approval reset is successful, if we can't check the allowance
          console.error('check allowance after revoke failed: ', error)
        }

        const newAllowance = CurrencyAmount.fromRawAmount(amountToApprove?.currency as Currency, newAllowanceRaw ?? 0n)
        if (!newAllowance.equalTo(0)) {
          throw new UserUnexpectedTxError({
            expectedData: 0,
            actualData: newAllowanceRaw?.toString(),
          })
        }

        setConfirmState(nextState ?? ConfirmModalState.APPROVING_TOKEN)
      } catch (error) {
        console.error('revoke error', error)
        if (userRejectedError(error)) {
          showError(t('Transaction rejected'))
        } else if (error instanceof UserUnexpectedTxError) {
          showError(t('Revoke transaction filled, but Approval not reset to 0. Please try again.'))
        } else {
          showError(typeof error === 'string' ? error : (error as any)?.message)
        }
      }
    }
    return {
      step: ConfirmModalState.RESETTING_APPROVAL,
      action,
      showIndicator: true,
    }
  }, [amountToApprove?.currency, refetch, retryWaitForTransaction, revoke, showError, t])

  const approveStep = useMemo(() => {
    const action = async (nextState?: ConfirmModalState) => {
      setTxHash(undefined)
      setConfirmState(ConfirmModalState.APPROVING_TOKEN)
      try {
        const result = await approve()

        if (result?.hash) {
          setTxHash(result.hash)

          await retryWaitForTransaction({ hash: result.hash })
        }
        // check if user really approved the amount trade needs
        let newAllowanceRaw: bigint = amountToApprove?.quotient ?? 0n
        // check if user really approved the amount trade needs
        try {
          const { data } = await refetch()
          newAllowanceRaw = data ?? 0n
        } catch (error) {
          // assume the approval is successful, if we can't check the allowance
          console.error('check allowance after approve failed: ', error)
        }
        const newAllowance = CurrencyAmount.fromRawAmount(amountToApprove?.currency as Currency, newAllowanceRaw ?? 0n)
        if (amountToApprove && newAllowance && newAllowance.lessThan(amountToApprove)) {
          throw new UserUnexpectedTxError({
            expectedData: amountToApprove.quotient.toString(),
            actualData: newAllowanceRaw.toString(),
          })
        }

        setConfirmState(nextState ?? ConfirmModalState.PENDING_CONFIRMATION)
      } catch (error) {
        console.error('approve error', error)
        if (userRejectedError(error)) {
          showError(t('Transaction rejected'))
        } else if (error instanceof UserUnexpectedTxError) {
          showError(
            t('Approve transaction filled, but Approval still not enough to fill current trade. Please try again.'),
          )
        } else {
          showError(typeof error === 'string' ? error : (error as any)?.message)
        }
      }
    }
    return {
      step: ConfirmModalState.APPROVING_TOKEN,
      action,
      showIndicator: true,
    }
  }, [amountToApprove, approve, refetch, retryWaitForTransaction, showError, t])

  const swapStep = useMemo(() => {
    const action = async () => {
      setTxHash(undefined)
      setConfirmState(ConfirmModalState.PENDING_CONFIRMATION)

      if (!swap) {
        resetState()
        return
      }

      if (swapCallbackError) {
        setErrorMessage(swapCallbackError)
        return
      }
      try {
        const result = await swap()
        if (result?.hash) {
          setTxHash(result.hash)
          const receipt = await retryWaitForTransaction({ hash: result.hash })
          if (receipt && receipt.status === 'reverted') {
            throw new Error('Transaction reverted')
          }
        }
        setConfirmState(ConfirmModalState.COMPLETED)
      } catch (error: any) {
        console.error('swap error', error)
        if (userRejectedError(error)) {
          resetState()
        } else {
          setErrorMessage(typeof error === 'string' ? error : error?.message)
        }
      }
    }
    return {
      step: ConfirmModalState.PENDING_CONFIRMATION,
      action,
      showIndicator: false,
    }
  }, [resetState, retryWaitForTransaction, swap, swapCallbackError])

  return {
    txHash,
    actions: {
      [ConfirmModalState.RESETTING_APPROVAL]: revokeStep,
      [ConfirmModalState.APPROVING_TOKEN]: approveStep,
      [ConfirmModalState.PENDING_CONFIRMATION]: swapStep,
    } as Record<ConfirmModalState, ConfirmAction>,

    confirmState,
    resetState,
    errorMessage,
  }
}

export const useMMConfirmModalState = (
  trade: SmartRouterTrade<TradeType> | V4Router.V4TradeWithoutGraph<TradeType> | undefined,
  swapCalls: MMSwapCall[],
  recipient: Address | null,
  amountToApprove: CurrencyAmount<Token> | undefined,
  spender: Address | undefined,
  expiredAt?: number,
) => {
  const { actions, confirmState, resetState, errorMessage, txHash } = useConfirmActions(
    trade,
    swapCalls,
    recipient,
    amountToApprove,
    spender,
    expiredAt,
  )
  const preConfirmState = usePreviousValue(confirmState)
  const [confirmSteps, setConfirmSteps] = useState<ConfirmModalState[]>()

  const createSteps = useCreateConfirmSteps(amountToApprove, spender)
  const confirmActions = useMemo(() => {
    return confirmSteps?.map((step) => actions[step])
  }, [confirmSteps, actions])

  const performStep = useCallback(
    async ({
      nextStep,
      stepActions,
      state,
    }: {
      nextStep?: ConfirmModalState
      stepActions: ConfirmAction[]
      state: ConfirmModalState
    }) => {
      if (!stepActions) {
        return
      }

      const step = stepActions.find((s) => s.step === state) ?? stepActions[0]

      await step.action(nextStep)
    },
    [],
  )
  const callToAction = useCallback(() => {
    const steps = createSteps()
    setConfirmSteps(steps)
    const stepActions = steps.map((step) => actions[step])
    const nextStep = steps[1] ?? undefined

    performStep({
      nextStep,
      stepActions,
      state: steps[0],
    })
  }, [actions, createSteps, performStep])

  // auto perform the next step
  useEffect(() => {
    if (
      preConfirmState !== confirmState &&
      preConfirmState !== ConfirmModalState.REVIEWING &&
      confirmActions?.some((step) => step.step === confirmState)
    ) {
      const nextStep = confirmActions.findIndex((step) => step.step === confirmState)
      const nextStepState = confirmActions[nextStep + 1]?.step ?? ConfirmModalState.PENDING_CONFIRMATION
      performStep({ nextStep: nextStepState, stepActions: confirmActions, state: confirmState })
    }
  }, [confirmActions, confirmState, performStep, preConfirmState])

  return {
    callToAction,
    errorMessage,
    confirmState,
    resetState,
    txHash,
    confirmActions,
  }
}
