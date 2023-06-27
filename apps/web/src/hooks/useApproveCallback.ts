import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, ERC20Token, Trade, TradeType } from '@pancakeswap/sdk'
import { useToast } from '@pancakeswap/uikit'
import { useAccount, Address } from 'wagmi'
import { V2_ROUTER_ADDRESS } from 'config/constants/exchange'
import { useCallback, useMemo } from 'react'
import { isUserRejected, logError } from 'utils/sentry'
import { SendTransactionResult } from 'wagmi/actions'
import { Field } from '../state/swap/actions'
import { useHasPendingApproval, useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin } from '../utils'
import { computeSlippageAdjustedAmounts } from '../utils/exchange'
import useGelatoLimitOrdersLib from './limitOrders/useGelatoLimitOrdersLib'
import { useCallWithGasPrice } from './useCallWithGasPrice'
import { useTokenContract } from './useContract'
import useTokenAllowance from './useTokenAllowance'

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount<Currency>,
  spender?: string,
  options: {
    addToTransaction
    targetAmount?: bigint
  } = {
    addToTransaction: true,
  },
): [ApprovalState, () => Promise<SendTransactionResult>] {
  const { addToTransaction = true, targetAmount } = options
  const { address: account } = useAccount()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { t } = useTranslation()
  const { toastError } = useToast()
  const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined
  const currentAllowance = useTokenAllowance(token, account ?? undefined, spender)
  const pendingApproval = useHasPendingApproval(token?.address, spender)

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    if (amountToApprove.currency?.isNative) return ApprovalState.APPROVED
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, pendingApproval, spender])

  const tokenContract = useTokenContract(token?.address)
  const addTransaction = useTransactionAdder()

  const approve = useCallback(async (): Promise<SendTransactionResult> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      toastError(t('Error'), t('Approve was called unnecessarily'))
      console.error('approve was called unnecessarily')
      return undefined
    }
    if (!token) {
      // toastError(t('Error'), t('No token'))
      console.error('no token')
      // return undefined
    }

    if (!tokenContract) {
      toastError(t('Error'), t('Cannot find contract of the token %tokenAddress%', { tokenAddress: token?.address }))
      console.error('tokenContract is null')
      return undefined
    }

    if (!amountToApprove) {
      toastError(t('Error'), t('Missing amount to approve'))
      console.error('missing amount to approve')
      return undefined
    }

    if (!spender) {
      toastError(t('Error'), t('No spender'))
      console.error('no spender')
      return undefined
    }

    let useExact = false

    const estimatedGas = await tokenContract.estimateGas
      .approve([spender as Address, MaxUint256], {
        account: tokenContract.account,
      })
      .catch(() => {
        // general fallback for tokens who restrict approval amounts
        useExact = true
        return tokenContract.estimateGas
          .approve([spender as Address, amountToApprove?.quotient ?? targetAmount ?? MaxUint256], {
            account: tokenContract.account,
          })
          .catch((e) => {
            console.error('estimate gas failure', e)
            toastError(t('Error'), t('Unexpected error. Could not estimate gas for the approve.'))
            return null
          })
      })

    if (!estimatedGas) return undefined

    return callWithGasPrice(
      tokenContract,
      'approve' as const,
      [spender as Address, useExact ? amountToApprove?.quotient ?? targetAmount ?? MaxUint256 : MaxUint256],
      {
        gas: calculateGasMargin(estimatedGas),
      },
    )
      .then((response) => {
        if (addToTransaction) {
          addTransaction(response, {
            summary: `Approve ${amountToApprove.currency.symbol}`,
            translatableSummary: { text: 'Approve %symbol%', data: { symbol: amountToApprove.currency.symbol } },
            approval: { tokenAddress: token.address, spender },
            type: 'approve',
          })
        }
        return response
      })
      .catch((error: any) => {
        logError(error)
        console.error('Failed to approve token', error)
        if (!isUserRejected(error)) {
          toastError(t('Error'), error.message)
        }
        throw error
      })
  }, [
    approvalState,
    token,
    tokenContract,
    amountToApprove,
    spender,
    callWithGasPrice,
    targetAmount,
    toastError,
    t,
    addToTransaction,
    addTransaction,
  ])

  return [approvalState, approve]
}

// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTrade(
  trade?: Trade<Currency, Currency, TradeType>,
  allowedSlippage = 0,
  chainId?: number,
) {
  const amountToApprove = useMemo(
    () => (trade ? computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT] : undefined),
    [trade, allowedSlippage],
  )

  return useApproveCallback(amountToApprove, V2_ROUTER_ADDRESS[chainId])
}

export function useApproveCallbackFromAmount({
  token,
  minAmount,
  targetAmount,
  spender,
  addToTransaction,
}: {
  token?: ERC20Token
  minAmount?: bigint
  targetAmount?: bigint
  spender?: string
  addToTransaction?: boolean
}) {
  const amountToApprove = useMemo(() => {
    if (!minAmount || !token) return undefined
    return CurrencyAmount.fromRawAmount(token, minAmount)
  }, [minAmount, token])

  return useApproveCallback(amountToApprove, spender, {
    addToTransaction,
    targetAmount,
  })
}

// Wraps useApproveCallback in the context of a Gelato Limit Orders
export function useApproveCallbackFromInputCurrencyAmount(currencyAmountIn: CurrencyAmount<Currency> | undefined) {
  const gelatoLibrary = useGelatoLimitOrdersLib()

  return useApproveCallback(currencyAmountIn, gelatoLibrary?.erc20OrderRouter.address ?? undefined)
}
