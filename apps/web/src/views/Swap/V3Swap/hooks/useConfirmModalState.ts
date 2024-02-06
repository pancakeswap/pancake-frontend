import { usePreviousValue } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { SmartRouterTrade } from '@pancakeswap/smart-router'
import { Currency, CurrencyAmount, Percent, Token, TradeType } from '@pancakeswap/swap-sdk-core'
import { Permit2Signature } from '@pancakeswap/universal-router-sdk'
import { ConfirmModalState, confirmPriceImpactWithoutFee } from '@pancakeswap/widgets-internal'
import { ALLOWED_PRICE_IMPACT_HIGH, PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN } from 'config/constants/exchange'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { usePermit2 } from 'hooks/usePermit2'
import { usePermit2Requires } from 'hooks/usePermit2Requires'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { publicClient } from 'utils/client'
import { UserUnexpectedTxError } from 'utils/errors'
import { Address, Hex } from 'viem'
import { computeTradePriceBreakdown } from '../utils/exchange'
import { userRejectedError } from './useSendSwapTransaction'
import { useSwapCallback } from './useSwapCallback'

export type ConfirmAction = {
  step: ConfirmModalState
  action: (nextStep?: ConfirmModalState) => Promise<void>
  showIndicator: boolean
}

const useCreateConfirmSteps = (amountToApprove: CurrencyAmount<Token> | undefined, spender: Address | undefined) => {
  const { requireApprove, requirePermit, requireRevoke } = usePermit2Requires(amountToApprove, spender)

  return useCallback(() => {
    const steps: ConfirmModalState[] = []
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
  }, [requireRevoke, requireApprove, requirePermit])
}

// define the actions of each step
const useConfirmActions = (
  trade: SmartRouterTrade<TradeType> | undefined,
  amountToApprove: CurrencyAmount<Token> | undefined,
  spender: Address | undefined,
) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const deadline = useTransactionDeadline()
  const { revoke, permit, approve, permit2Allowance, refetch } = usePermit2(amountToApprove, spender)
  const [permit2Signature, setPermit2Signature] = useState<Permit2Signature | undefined>(undefined)
  const { callback: swap, error: swapError } = useSwapCallback({
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
    setErrorMessage(undefined)
    setPermit2Signature(undefined)
  }, [])

  // define the action of each step
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
            actualData: permit2Allowance?.toExact(),
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
  }, [amountToApprove?.currency, chainId, permit2Allowance, refetch, resetState, revoke])

  const permitStep = useMemo(() => {
    return {
      step: ConfirmModalState.PERMITTING,
      action: async (nextState?: ConfirmModalState) => {
        setConfirmState(ConfirmModalState.PERMITTING)
        try {
          const result = await permit()
          setPermit2Signature(result)
          setConfirmState(nextState ?? ConfirmModalState.PENDING_CONFIRMATION)
        } catch (error) {
          if (userRejectedError(error)) {
            resetState()
          }
        }
      },
      showIndicator: true,
    }
  }, [permit, resetState])

  const approveStep = useMemo(() => {
    return {
      step: ConfirmModalState.APPROVING_TOKEN,
      action: async (nextState?: ConfirmModalState) => {
        setTxHash(undefined)
        setConfirmState(ConfirmModalState.APPROVING_TOKEN)
        try {
          const result = await approve()
          if (result?.hash) {
            setTxHash(result.hash)
            await publicClient({ chainId }).waitForTransactionReceipt({ hash: result.hash, confirmations: 1 })
          }
          // check if user really approved the amount trade needs
          const { data } = await refetch()
          const newAllowance = CurrencyAmount.fromRawAmount(amountToApprove?.currency as Currency, data ?? 0n)
          if (amountToApprove && newAllowance && newAllowance.lessThan(amountToApprove)) {
            throw new UserUnexpectedTxError({
              expectedData: amountToApprove.toExact(),
              actualData: permit2Allowance?.toExact(),
            })
          }

          setConfirmState(nextState ?? ConfirmModalState.PERMITTING)
        } catch (error) {
          console.error('approve error', error)
          if (userRejectedError(error) || error instanceof UserUnexpectedTxError) {
            resetState()
          }
        }
      },
      showIndicator: true,
    }
  }, [amountToApprove, approve, chainId, permit2Allowance, refetch, resetState])

  const tradePriceBreakdown = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const swapPreflightCheck = useCallback(() => {
    if (
      tradePriceBreakdown &&
      !confirmPriceImpactWithoutFee(
        tradePriceBreakdown.priceImpactWithoutFee as Percent,
        PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN,
        ALLOWED_PRICE_IMPACT_HIGH,
        t,
      )
    ) {
      return false
    }
    return true
  }, [t, tradePriceBreakdown])

  const swapStep = useMemo(() => {
    return {
      step: ConfirmModalState.PENDING_CONFIRMATION,
      action: async () => {
        setTxHash(undefined)
        setConfirmState(ConfirmModalState.PENDING_CONFIRMATION)

        if (!swap || !swapPreflightCheck()) {
          resetState()
          return
        }

        if (swapError) {
          setErrorMessage(swapError)
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
      },
      showIndicator: false,
    }
  }, [chainId, resetState, swap, swapError, swapPreflightCheck])

  const actions = useMemo(() => {
    return {
      [ConfirmModalState.RESETTING_APPROVAL]: revokeStep,
      [ConfirmModalState.PERMITTING]: permitStep,
      [ConfirmModalState.APPROVING_TOKEN]: approveStep,
      [ConfirmModalState.PENDING_CONFIRMATION]: swapStep,
    } as { [k in ConfirmModalState]: ConfirmAction }
  }, [approveStep, permitStep, revokeStep, swapStep])

  return {
    txHash,
    actions,

    confirmState,
    resetState,
    errorMessage,
  }
}

export const useConfirmModalState = (
  trade: SmartRouterTrade<TradeType> | undefined,
  amountToApprove: CurrencyAmount<Token> | undefined,
  spender: Address | undefined,
) => {
  const { actions, confirmState, txHash, errorMessage, resetState } = useConfirmActions(trade, amountToApprove, spender)
  const preConfirmState = usePreviousValue(confirmState)
  const [confirmSteps, setConfirmSteps] = useState<ConfirmModalState[]>()

  const createSteps = useCreateConfirmSteps(amountToApprove, spender)
  const confirmActions = useMemo(() => {
    return confirmSteps?.map((step) => actions[step])
  }, [confirmSteps, actions])

  const performStep = useCallback(
    async (nextStep?: ConfirmModalState) => {
      if (!confirmActions) {
        return
      }

      const step = confirmActions.find((s) => s.step === confirmState) ?? confirmActions[0]

      await step.action(nextStep)
    },
    [confirmActions, confirmState],
  )

  const callToAction = useCallback(() => {
    const steps = createSteps()
    setConfirmSteps(steps)
    const nextStep = steps[1] ?? undefined

    performStep(nextStep)
  }, [createSteps, performStep])

  // auto perform the next step
  useEffect(() => {
    if (
      preConfirmState !== confirmState &&
      preConfirmState !== ConfirmModalState.REVIEWING &&
      confirmActions?.some((step) => step.step === confirmState)
    ) {
      const nextStep = confirmActions.findIndex((step) => step.step === confirmState)
      const nextStepState = confirmActions[nextStep + 1]?.step ?? ConfirmModalState.PENDING_CONFIRMATION
      performStep(nextStepState)
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
