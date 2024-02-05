import { usePreviousValue } from '@pancakeswap/hooks'
import { SmartRouterTrade } from '@pancakeswap/smart-router'
import { CurrencyAmount, Token, TradeType } from '@pancakeswap/swap-sdk-core'
import { ConfirmModalState } from '@pancakeswap/widgets-internal'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { usePermit2 } from 'hooks/usePermit2'
import { usePermit2Requires } from 'hooks/usePermit2Requires'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { isUserRejected } from 'utils/sentry'
import { Address, Hex, UserRejectedRequestError } from 'viem'
import { usePublicClient } from 'wagmi'
import { TransactionRejectedError } from './useSendSwapTransaction'
import { useSwapCallback } from './useSwapCallback'

const userRejectedError = (error: unknown): boolean => {
  return (
    error instanceof UserRejectedRequestError ||
    error instanceof TransactionRejectedError ||
    (typeof error !== 'string' && isUserRejected(error))
  )
}

type ConfirmAction = { step: ConfirmModalState; action: () => Promise<void> }

const useCreateConfirmSteps = (
  amountToApprove: CurrencyAmount<Token> | undefined,
  spender: Address | undefined,
  actions: Record<ConfirmModalState, ConfirmAction>,
) => {
  const { requireApprove, requirePermit, requireRevoke } = usePermit2Requires(amountToApprove, spender)

  return useCallback(() => {
    const steps: ConfirmAction[] = []
    if (requireRevoke) {
      steps.push(actions[ConfirmModalState.RESETTING_APPROVAL])
    }
    if (requireApprove) {
      steps.push(actions[ConfirmModalState.APPROVING_TOKEN])
    }
    if (requirePermit) {
      steps.push(actions[ConfirmModalState.PERMITTING])
    }
    steps.push(actions[ConfirmModalState.PENDING_CONFIRMATION])
    return steps
  }, [requireRevoke, requireApprove, requirePermit, actions])
}

// define the actions of each step
const useConfirmActions = (
  trade: SmartRouterTrade<TradeType> | undefined,
  amountToApprove: CurrencyAmount<Token> | undefined,
  spender: Address | undefined,
) => {
  const { chainId } = useActiveChainId()
  const provider = usePublicClient({ chainId })
  const deadline = useTransactionDeadline()
  const { revoke, permit, approve, permit2Signature } = usePermit2(amountToApprove, spender)
  const {
    callback: swap,
    error: swapError,
    reason: swapRevertReason,
  } = useSwapCallback({
    trade,
    deadline,
    permitSignature: permit2Signature,
  })
  const [confirmState, setConfirmState] = useState<ConfirmModalState>(ConfirmModalState.REVIEWING)
  const [txHash, setTxHash] = useState<Hex | undefined>(undefined)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  const resetState = useCallback(() => {
    setConfirmState(ConfirmModalState.REVIEWING)
    setTxHash(undefined)
  }, [])

  // define the action of each step
  const revokeStep = useMemo(() => {
    const action = async (nextState?: ConfirmModalState) => {
      setTxHash(undefined)
      try {
        const result = await revoke()
        if (result?.hash) {
          setTxHash(result.hash)
          await provider.waitForTransactionReceipt({ hash: result.hash })
        }
        setConfirmState(nextState ?? ConfirmModalState.APPROVING_TOKEN)
      } catch (error) {
        if (userRejectedError(error)) {
          resetState()
        }
      }
    }
    return {
      step: ConfirmModalState.RESETTING_APPROVAL,
      action,
    }
  }, [provider, resetState, revoke])

  const permitStep = useMemo(() => {
    return {
      step: ConfirmModalState.PERMITTING,
      action: async (nextState?: ConfirmModalState) => {
        try {
          await permit()
          setConfirmState(nextState ?? ConfirmModalState.PENDING_CONFIRMATION)
        } catch (error) {
          if (userRejectedError(error)) {
            resetState()
          }
        }
      },
    }
  }, [permit, resetState])

  const approveStep = useMemo(() => {
    return {
      step: ConfirmModalState.APPROVING_TOKEN,
      action: async (nextState?: ConfirmModalState) => {
        setTxHash(undefined)
        try {
          const result = await approve()
          if (result?.hash) {
            setTxHash(result.hash)
            await provider.waitForTransactionReceipt({ hash: result.hash })
          }
          setConfirmState(nextState ?? ConfirmModalState.PERMITTING)
        } catch (error) {
          if (userRejectedError(error)) {
            resetState()
          }
        }
      },
    }
  }, [approve, provider, resetState])

  const swapStep = useMemo(() => {
    return {
      step: ConfirmModalState.PENDING_CONFIRMATION,
      action: async () => {
        setTxHash(undefined)

        if (!swap) return

        try {
          const result = await swap()
          if (result?.hash) {
            setTxHash(result.hash)
            await provider.waitForTransactionReceipt({ hash: result.hash })
          }
          setConfirmState(ConfirmModalState.COMPLETED)
        } catch (error) {
          if (userRejectedError(error)) {
            resetState()
          } else {
            setErrorMessage(swapRevertReason)
          }
        }
      },
    }
  }, [provider, resetState, swap, swapRevertReason])

  return {
    txHash,
    actions: {
      [ConfirmModalState.RESETTING_APPROVAL]: revokeStep,
      [ConfirmModalState.PERMITTING]: permitStep,
      [ConfirmModalState.APPROVING_TOKEN]: approveStep,
      [ConfirmModalState.PENDING_CONFIRMATION]: swapStep,
    } as { [k in ConfirmModalState]: ConfirmAction },

    confirmState,
    errorMessage,
  }
}

export const useConfirmModalStateV2 = (
  trade: SmartRouterTrade<TradeType> | undefined,
  amountToApprove: CurrencyAmount<Token> | undefined,
  spender: Address | undefined,
) => {
  const { actions, confirmState } = useConfirmActions(trade, amountToApprove, spender)
  const preConfirmState = usePreviousValue(confirmState)
  const confirmSteps = useRef<ConfirmAction[]>()

  const createSteps = useCreateConfirmSteps(amountToApprove, spender, actions)

  const performStep = useCallback(async () => {
    if (!confirmSteps.current) {
      return
    }

    const steps = confirmSteps.current
    const step = steps.find((s) => s.step === confirmState) ?? steps[0]

    await step.action()
  }, [confirmState])

  const callToAction = useCallback(() => {
    const steps = createSteps()
    confirmSteps.current = steps

    performStep()
  }, [createSteps, performStep])

  // auto perform the next step
  useEffect(() => {
    if (preConfirmState !== confirmState && confirmState !== ConfirmModalState.REVIEWING) {
      performStep()
    }
  }, [confirmState, performStep, preConfirmState])

  return {
    callToAction,
    confirmState,
  }
}
