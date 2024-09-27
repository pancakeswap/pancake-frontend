import { usePreviousValue } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { getPermit2Address } from '@pancakeswap/permit2-sdk'
import { PriceOrder } from '@pancakeswap/price-api-sdk'
import { Currency, CurrencyAmount, Percent, Token } from '@pancakeswap/swap-sdk-core'
import { Permit2Signature } from '@pancakeswap/universal-router-sdk'
import { ConfirmModalState, useAsyncConfirmPriceImpactWithoutFee } from '@pancakeswap/widgets-internal'
import { ALLOWED_PRICE_IMPACT_HIGH, PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN } from 'config/constants/exchange'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useNativeWrap } from 'hooks/useNativeWrap'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { usePermit2 } from 'hooks/usePermit2'
import { usePermit2Requires } from 'hooks/usePermit2Requires'
import { useSafeTxHashTransformer } from 'hooks/useSafeTxHashTransformer'
import { useTransactionDeadline } from 'hooks/useTransactionDeadline'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { RetryableError, retry } from 'state/multicall/retry'
import { logGTMSwapTxSentEvent } from 'utils/customGTMEventTracking'
import { UserUnexpectedTxError } from 'utils/errors'
import { publicClient } from 'utils/wagmi'
import { logSwap } from 'utils/log'
import {
  Address,
  Hex,
  TransactionNotFoundError,
  TransactionReceipt,
  TransactionReceiptNotFoundError,
  erc20Abi,
} from 'viem'
import { useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { isClassicOrder, isXOrder } from 'views/Swap/utils'
import { waitForXOrderReceipt } from 'views/Swap/x/api'
import { useSendXOrder } from 'views/Swap/x/useSendXOrder'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { BLOCK_CONFIRMATION } from 'config/confirmation'

import { computeTradePriceBreakdown } from '../utils/exchange'
import { userRejectedError } from './useSendSwapTransaction'
import { useSwapCallback } from './useSwapCallback'

export type ConfirmAction = {
  step: ConfirmModalState
  action: (nextStep?: ConfirmModalState) => Promise<void>
  showIndicator: boolean
}

const getTokenAllowance = ({
  chainId,
  address,
  inputs,
}: {
  chainId: number
  address: Address
  inputs: [`0x${string}`, `0x${string}`]
}) => {
  const client = publicClient({ chainId })

  return client.readContract({
    abi: erc20Abi,
    address,
    functionName: 'allowance',
    args: inputs,
  })
}

const useCreateConfirmSteps = (
  order: PriceOrder | undefined,
  amountToApprove: CurrencyAmount<Token> | undefined,
  spender: Address | undefined,
) => {
  const { requireApprove, requirePermit, requireRevoke } = usePermit2Requires(amountToApprove, spender)
  const nativeCurrency = useNativeCurrency(order?.trade?.inputAmount.currency.chainId)
  const { account } = useAccountActiveChain()
  const balance = useCurrencyBalance(account ?? undefined, nativeCurrency.wrapped)

  return useCallback(() => {
    const steps: ConfirmModalState[] = []
    if (
      isXOrder(order) &&
      order.trade.inputAmount.currency.isNative &&
      amountToApprove &&
      (!balance || balance.lessThan(amountToApprove))
    ) {
      steps.push(ConfirmModalState.WRAPPING)
    }
    if (requireRevoke) {
      steps.push(ConfirmModalState.RESETTING_APPROVAL)
    }
    if (requireApprove) {
      steps.push(ConfirmModalState.APPROVING_TOKEN)
    }
    if (isClassicOrder(order) && requirePermit) {
      steps.push(ConfirmModalState.PERMITTING)
    }
    steps.push(ConfirmModalState.PENDING_CONFIRMATION)
    return steps
  }, [requireRevoke, requireApprove, requirePermit, order, balance, amountToApprove])
}

// define the actions of each step
const useConfirmActions = (
  order: PriceOrder | undefined,
  amountToApprove: CurrencyAmount<Token> | undefined,
  spender: Address | undefined,
) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const [deadline] = useTransactionDeadline()
  const safeTxHashTransformer = useSafeTxHashTransformer()
  const { revoke, permit, approve } = usePermit2(amountToApprove, spender, {
    enablePaymaster: true,
  })
  const nativeWrap = useNativeWrap()
  const { account } = useAccountActiveChain()
  const getAllowanceArgs = useMemo(() => {
    if (!chainId) return undefined
    const inputs = [account, getPermit2Address(chainId)] as [`0x${string}`, `0x${string}`]
    return {
      chainId,
      address: amountToApprove?.currency.address as Address,
      inputs,
    }
  }, [chainId, amountToApprove?.currency.address, account])
  const [permit2Signature, setPermit2Signature] = useState<Permit2Signature | undefined>(undefined)
  const { callback: swap, error: swapError } = useSwapCallback({
    trade: isClassicOrder(order) ? order.trade : undefined,
    deadline,
    permitSignature: permit2Signature,
  })

  const nativeCurrency = useNativeCurrency(order?.trade?.inputAmount.currency.chainId)
  const wrappedBalance = useCurrencyBalance(account ?? undefined, nativeCurrency.wrapped)

  const { mutateAsync: sendXOrder } = useSendXOrder()

  const [confirmState, setConfirmState] = useState<ConfirmModalState>(ConfirmModalState.REVIEWING)
  const [txHash, setTxHash] = useState<Hex | undefined>(undefined)
  const [orderHash, setOrderHash] = useState<Hex | undefined>(undefined)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const { toastSuccess, toastError } = useToast()

  const resetState = useCallback(() => {
    setConfirmState(ConfirmModalState.REVIEWING)
    setTxHash(undefined)
    setErrorMessage(undefined)
    setPermit2Signature(undefined)
  }, [])

  const showError = useCallback((error: string) => {
    setErrorMessage(error)
    setTxHash(undefined)
    setPermit2Signature(undefined)
  }, [])

  const retryWaitForTransaction = useCallback(
    async ({ hash, confirmations }: { hash?: Hex; confirmations?: number }) => {
      if (hash && chainId) {
        let retryTimes = 0
        const getReceipt = async () => {
          console.info('retryWaitForTransaction', hash, retryTimes++)
          try {
            return await publicClient({ chainId }).waitForTransactionReceipt({
              hash,
              confirmations,
            })
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
          maxWait: confirmations ? confirmations * 5000 : 5000,
        })
        return promise
      }
      return undefined
    },
    [chainId],
  )

  // define the action of each step
  const revokeStep = useMemo(() => {
    const action = async (nextState?: ConfirmModalState) => {
      setTxHash(undefined)
      setConfirmState(ConfirmModalState.RESETTING_APPROVAL)
      try {
        const result = await revoke()
        if (result?.hash) {
          const hash = await safeTxHashTransformer(result.hash)
          setTxHash(hash)

          await retryWaitForTransaction({ hash })
        }

        let newAllowanceRaw: bigint = 0n

        try {
          // check if user really reset the approval to 0
          // const { data } = await refetch()
          if (getAllowanceArgs) {
            const data = await getTokenAllowance(getAllowanceArgs)
            newAllowanceRaw = data ?? 0n
          }
        } catch (error) {
          // assume the approval reset is successful, if we can't check the allowance
          console.error('check allowance after revoke failed: ', error)
        }

        const newAllowance = CurrencyAmount.fromRawAmount(amountToApprove?.currency as Currency, newAllowanceRaw ?? 0n)
        if (!newAllowance.equalTo(0)) {
          throw new UserUnexpectedTxError({
            expectedData: 0,
            actualData: newAllowanceRaw.toString(),
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
  }, [
    amountToApprove?.currency,
    getAllowanceArgs,
    retryWaitForTransaction,
    revoke,
    safeTxHashTransformer,
    showError,
    t,
  ])

  const permitStep = useMemo(() => {
    return {
      step: ConfirmModalState.PERMITTING,
      action: async (nextState?: ConfirmModalState) => {
        setConfirmState(ConfirmModalState.PERMITTING)
        try {
          const { tx, ...result } = (await permit()) ?? {}
          if (tx) {
            const hash = await safeTxHashTransformer(tx)
            retryWaitForTransaction({ hash })
            // use transferAllowance, no need to use permit signature
            setPermit2Signature(undefined)
          } else {
            setPermit2Signature(result)
          }
          setConfirmState(nextState ?? ConfirmModalState.PENDING_CONFIRMATION)
        } catch (error) {
          if (userRejectedError(error)) {
            showError('Transaction rejected')
          } else {
            showError(typeof error === 'string' ? error : (error as any)?.message)
          }
        }
      },
      showIndicator: true,
    }
  }, [permit, retryWaitForTransaction, safeTxHashTransformer, showError])

  const wrapStep = useMemo(() => {
    return {
      step: ConfirmModalState.WRAPPING,
      action: async (nextState?: ConfirmModalState) => {
        try {
          setConfirmState(ConfirmModalState.WRAPPING)
          const wrapAmount = BigInt(amountToApprove?.quotient ?? 0)
          const result = await nativeWrap(wrapAmount - (wrappedBalance?.quotient ?? 0n))
          if (result && result.hash) {
            const chain = amountToApprove?.currency.chainId
            await retryWaitForTransaction({
              hash: txHash,
              confirmations: chain ? BLOCK_CONFIRMATION[chain] : undefined,
            })
          }
          if (nextState) {
            setConfirmState(nextState)
          }
        } catch (error) {
          console.error('wrap error', error)
          if (userRejectedError(error)) {
            showError('Transaction rejected')
          } else {
            showError(typeof error === 'string' ? error : (error as any)?.message)
          }
        }
      },
      showIndicator: true,
    }
  }, [amountToApprove, nativeWrap, retryWaitForTransaction, showError, txHash, wrappedBalance?.quotient])

  const approveStep = useMemo(() => {
    return {
      step: ConfirmModalState.APPROVING_TOKEN,
      action: async (nextState?: ConfirmModalState) => {
        setTxHash(undefined)
        setConfirmState(ConfirmModalState.APPROVING_TOKEN)
        try {
          const result = await approve()
          if (result?.hash && chainId) {
            const hash = await safeTxHashTransformer(result.hash)
            setTxHash(hash)
            await retryWaitForTransaction({ hash })
          }
          let newAllowanceRaw: bigint = amountToApprove?.quotient ?? 0n
          // check if user really approved the amount trade needs
          try {
            if (getAllowanceArgs) {
              const data = await getTokenAllowance(getAllowanceArgs)
              newAllowanceRaw = data ?? 0n
            }
          } catch (error) {
            // assume the approval is successful, if we can't check the allowance
            console.error('check allowance after approve failed: ', error)
          }
          const newAllowance = CurrencyAmount.fromRawAmount(
            amountToApprove?.currency as Currency,
            newAllowanceRaw ?? 0n,
          )
          if (amountToApprove && newAllowance && newAllowance.lessThan(amountToApprove)) {
            throw new UserUnexpectedTxError({
              expectedData: amountToApprove.quotient.toString(),
              actualData: newAllowanceRaw.toString(),
            })
          }

          setConfirmState(nextState ?? ConfirmModalState.PERMITTING)
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
      },
      showIndicator: true,
    }
  }, [
    amountToApprove,
    approve,
    chainId,
    getAllowanceArgs,
    retryWaitForTransaction,
    safeTxHashTransformer,
    showError,
    t,
  ])

  const swapStep = useMemo(() => {
    return {
      step: ConfirmModalState.PENDING_CONFIRMATION,
      action: async () => {
        setTxHash(undefined)
        setConfirmState(ConfirmModalState.PENDING_CONFIRMATION)

        if (!swap) {
          resetState()
          return
        }

        if (swapError) {
          showError(swapError)
          return
        }

        try {
          const result = await swap()
          if (result?.hash) {
            const hash = await safeTxHashTransformer(result.hash)
            logGTMSwapTxSentEvent()
            setTxHash(hash)

            await retryWaitForTransaction({ hash })
          }
          setConfirmState(ConfirmModalState.COMPLETED)
        } catch (error: any) {
          console.error('swap error', error)
          if (userRejectedError(error)) {
            showError('Transaction rejected')
          } else {
            showError(typeof error === 'string' ? error : (error as any)?.message)
          }
        }
      },
      showIndicator: false,
    }
  }, [resetState, retryWaitForTransaction, safeTxHashTransformer, showError, swap, swapError])

  const xSwapStep = useMemo(() => {
    return {
      step: ConfirmModalState.PENDING_CONFIRMATION,
      action: async () => {
        setTxHash(undefined)
        setConfirmState(ConfirmModalState.PENDING_CONFIRMATION)

        if (!isXOrder(order)) {
          resetState()
          return
        }

        // if (swapError) {
        //   showError(swapError)
        //   return
        // }

        try {
          const xOrder = await sendXOrder({
            chainId: order.trade.inputAmount.currency.chainId,
            orderInfo: {
              ...order.trade.orderInfo,
              input: {
                ...order.trade.orderInfo.input,
                token:
                  order.trade.inputAmount.currency.isNative && nativeCurrency
                    ? nativeCurrency.wrapped.address
                    : order.trade.orderInfo.input.token,
              },
            },
          })
          if (xOrder?.hash) {
            setOrderHash(xOrder.hash)
            const inputAmount = order.trade.maximumAmountIn.toExact()
            const outputAmount = order.trade.minimumAmountOut.toExact()
            const input = order.trade.inputAmount.currency
            const output = order.trade.outputAmount.currency
            const { tradeType } = order.trade
            logSwap({
              tradeType,
              account: account ?? '0x',
              chainId: xOrder.chainId,
              hash: xOrder.hash,
              inputAmount,
              outputAmount,
              input,
              output,
              type: 'X',
            })
            const receipt = await waitForXOrderReceipt(xOrder)

            if (receipt.transactionHash) {
              logSwap({
                tradeType,
                account: account ?? '0x',
                chainId: xOrder.chainId,
                hash: receipt.transactionHash,
                inputAmount,
                outputAmount,
                input,
                output,
                type: 'X-Filled',
              })
              setTxHash(receipt.transactionHash)
              setConfirmState(ConfirmModalState.COMPLETED)
              toastSuccess(
                t('Success!'),
                <ToastDescriptionWithTx txHash={receipt.transactionHash} txChainId={xOrder.chainId}>
                  {t('Swap order filled')}
                </ToastDescriptionWithTx>,
              )
            }
          }
        } catch (error: any) {
          console.error('swap error', error)
          if (userRejectedError(error)) {
            showError('Transaction rejected')
          } else {
            const errorMsg = typeof error === 'string' ? error : (error as any)?.message
            showError(errorMsg)
            toastError(t('Failed'), errorMsg)
          }
        }
      },
      showIndicator: false,
    }
  }, [account, t, order, resetState, sendXOrder, showError, nativeCurrency, toastSuccess, toastError])

  const actions = useMemo(() => {
    return {
      [ConfirmModalState.WRAPPING]: wrapStep,
      [ConfirmModalState.RESETTING_APPROVAL]: revokeStep,
      [ConfirmModalState.PERMITTING]: permitStep,
      [ConfirmModalState.APPROVING_TOKEN]: approveStep,
      [ConfirmModalState.PENDING_CONFIRMATION]: isClassicOrder(order) ? swapStep : xSwapStep,
    } as { [k in ConfirmModalState]: ConfirmAction }
  }, [revokeStep, permitStep, approveStep, order, swapStep, xSwapStep, wrapStep])

  return {
    txHash,
    orderHash,
    actions,

    confirmState,
    resetState,
    errorMessage,
  }
}

export const useConfirmModalState = (
  order: PriceOrder | undefined,
  amountToApprove: CurrencyAmount<Token> | undefined,
  spender: Address | undefined,
) => {
  const { actions, confirmState, txHash, orderHash, errorMessage, resetState } = useConfirmActions(
    order,
    amountToApprove,
    spender,
  )
  const preConfirmState = usePreviousValue(confirmState)
  const [confirmSteps, setConfirmSteps] = useState<ConfirmModalState[]>()
  const tradePriceBreakdown = useMemo(
    () => (isClassicOrder(order) ? computeTradePriceBreakdown(order?.trade) : undefined),
    [order],
  )
  const confirmPriceImpactWithoutFee = useAsyncConfirmPriceImpactWithoutFee(
    tradePriceBreakdown?.priceImpactWithoutFee as Percent,
    PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN,
    ALLOWED_PRICE_IMPACT_HIGH,
  )
  const swapPreflightCheck = useCallback(async () => {
    if (tradePriceBreakdown) {
      const confirmed = await confirmPriceImpactWithoutFee()
      if (!confirmed) {
        return false
      }
    }
    return true
  }, [confirmPriceImpactWithoutFee, tradePriceBreakdown])

  const createSteps = useCreateConfirmSteps(order, amountToApprove, spender)
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

  const callToAction = useCallback(async () => {
    const steps = createSteps()
    setConfirmSteps(steps)
    const stepActions = steps.map((step) => actions[step])
    const nextStep = steps[1] ?? undefined

    if (!(await swapPreflightCheck())) {
      return
    }

    performStep({
      nextStep,
      stepActions,
      state: steps[0],
    })
  }, [actions, createSteps, performStep, swapPreflightCheck])

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
    orderHash,
    confirmActions,
  }
}
