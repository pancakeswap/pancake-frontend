import { usePreviousValue } from '@pancakeswap/hooks'
import { SmartRouterTrade } from '@pancakeswap/smart-router'
import { Currency, CurrencyAmount, Token, TradeType } from '@pancakeswap/swap-sdk-core'
import { ConfirmModalState } from '@pancakeswap/widgets-internal'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { publicClient } from 'utils/client'
import { UserUnexpectedTxError } from 'utils/errors'
import { Address, Hex } from 'viem'
import { ConfirmAction } from 'views/Swap/V3Swap/hooks/useConfirmModalState'
import { userRejectedError } from 'views/Swap/V3Swap/hooks/useSendSwapTransaction'
import { useApprove, useApproveRequires } from './useApprove'
import { MMSwapCall } from './useSwapCallArguments'
import { useSwapCallback } from './useSwapCallback'

const useConfirmActions = (
  trade: SmartRouterTrade<TradeType>,
  swapCalls: MMSwapCall[],
  recipient: Address | null,
  amountToApprove: CurrencyAmount<Token> | undefined,
  spender: Address | undefined,
) => {
  const { chainId } = useActiveChainId()
  const { revoke, approve, allowance, refetch } = useApprove(amountToApprove, spender)
  const { callback: swap, error: swapCallbackError } = useSwapCallback(trade, recipient, swapCalls)

  const [confirmState, setConfirmState] = useState<ConfirmModalState>(ConfirmModalState.REVIEWING)
  const [txHash, setTxHash] = useState<Hex | undefined>(undefined)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  const resetState = useCallback(() => {
    setConfirmState(ConfirmModalState.REVIEWING)
    setTxHash(undefined)
    setErrorMessage(undefined)
  }, [])

  const revokeStep = useMemo(() => {
    const action = async (nextState?: ConfirmModalState) => {
      setTxHash(undefined)
      setConfirmState(ConfirmModalState.RESETTING_APPROVAL)
      try {
        const result = await revoke()
        if (result?.hash) {
          setTxHash(result.hash)
          await publicClient({ chainId }).waitForTransactionReceipt({ hash: result.hash })
        }

        // check if user really reset the approval to 0
        const { data } = await refetch()
        const newAllowance = CurrencyAmount.fromRawAmount(amountToApprove?.currency as Currency, data ?? 0n)
        if (!newAllowance.equalTo(0)) {
          throw new UserUnexpectedTxError({
            expectedData: 0,
            actualData: allowance?.toExact(),
          })
        }

        setConfirmState(nextState ?? ConfirmModalState.APPROVING_TOKEN)
      } catch (error) {
        console.error('revoke error', error)
        if (userRejectedError(error) || error instanceof UserUnexpectedTxError) {
          resetState()
        }
      }
    }
    return {
      step: ConfirmModalState.RESETTING_APPROVAL,
      action,
      showIndicator: true,
    }
  }, [allowance, amountToApprove?.currency, chainId, refetch, resetState, revoke])

  const approveStep = useMemo(() => {
    const action = async (nextState?: ConfirmModalState) => {
      setTxHash(undefined)
      setConfirmState(ConfirmModalState.APPROVING_TOKEN)
      try {
        const result = await approve()
        if (result?.hash) {
          setTxHash(result.hash)
          await publicClient({ chainId }).waitForTransactionReceipt({ hash: result.hash })
        }
        // check if user really approved the amount trade needs
        const { data } = await refetch()
        const newAllowance = CurrencyAmount.fromRawAmount(amountToApprove?.currency as Currency, data ?? 0n)
        if (amountToApprove && newAllowance && newAllowance.lessThan(amountToApprove)) {
          throw new UserUnexpectedTxError({
            expectedData: amountToApprove.toExact(),
            actualData: allowance?.toExact(),
          })
        }

        setConfirmState(nextState ?? ConfirmModalState.PENDING_CONFIRMATION)
      } catch (error) {
        console.error('approve error', error)
        if (userRejectedError(error) || error instanceof UserUnexpectedTxError) {
          resetState()
        }
      }
    }
    return {
      step: ConfirmModalState.APPROVING_TOKEN,
      action,
      showIndicator: true,
    }
  }, [allowance, amountToApprove, approve, chainId, refetch, resetState])

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
          await publicClient({ chainId }).waitForTransactionReceipt({ hash: result.hash })
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
  }, [chainId, resetState, swap, swapCallbackError])

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

const useCreateConfirmSteps = (
  amountToApprove: CurrencyAmount<Token> | undefined,
  spender: Address | undefined,
  actions: Record<ConfirmModalState, ConfirmAction>,
) => {
  const { requireApprove, requireRevoke } = useApproveRequires(amountToApprove, spender)

  return useCallback(() => {
    const steps: ConfirmAction[] = []
    if (requireRevoke) {
      steps.push(actions[ConfirmModalState.RESETTING_APPROVAL])
    }
    if (requireApprove) {
      steps.push(actions[ConfirmModalState.APPROVING_TOKEN])
    }
    steps.push(actions[ConfirmModalState.PENDING_CONFIRMATION])
    return steps
  }, [actions, requireApprove, requireRevoke])
}

export const useMMConfirmModalState = (
  trade: SmartRouterTrade<TradeType>,
  swapCalls: MMSwapCall[],
  recipient: Address | null,
  amountToApprove: CurrencyAmount<Token> | undefined,
  spender: Address | undefined,
) => {
  const { actions, confirmState, resetState, errorMessage, txHash } = useConfirmActions(
    trade,
    swapCalls,
    recipient,
    amountToApprove,
    spender,
  )
  const preConfirmState = usePreviousValue(confirmState)
  const confirmSteps = useRef<ConfirmAction[]>()

  const createSteps = useCreateConfirmSteps(amountToApprove, spender, actions)

  const performStep = useCallback(
    async (nextStep?: ConfirmModalState) => {
      if (!confirmSteps.current) {
        return
      }

      const steps = confirmSteps.current
      const step = steps.find((s) => s.step === confirmState) ?? steps[0]

      await step.action(nextStep)
    },
    [confirmState],
  )

  const callToAction = useCallback(() => {
    const steps = createSteps()
    confirmSteps.current = steps
    const nextStep = steps[1] ? steps[1].step : undefined

    performStep(nextStep)
  }, [createSteps, performStep])

  // auto perform the next step
  useEffect(() => {
    if (
      preConfirmState !== confirmState &&
      preConfirmState !== ConfirmModalState.REVIEWING &&
      confirmSteps.current?.some((step) => step.step === confirmState)
    ) {
      performStep(confirmState)
    }
  }, [confirmState, performStep, preConfirmState])

  return {
    callToAction,
    errorMessage,
    confirmState,
    resetState,
    txHash,
    confirmSteps: confirmSteps.current,
  }
}
