import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { Trade, TokenAmount, CurrencyAmount, ETHER } from '@pancakeswap/sdk'
import { CHAIN_ID } from 'config/constants/networks'
import { useCallback, useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { logError } from 'utils/sentry'
import { ROUTER_ADDRESS } from '../config/constants'
import useTokenAllowance from './useTokenAllowance'
import { Field } from '../state/swap/actions'
import { useTransactionAdder, useHasPendingApproval } from '../state/transactions/hooks'
import { computeSlippageAdjustedAmounts } from '../utils/prices'
import { calculateGasMargin } from '../utils'
import { useTokenContract } from './useContract'
import { useCallWithGasPrice } from './useCallWithGasPrice'
import useToast from './useToast'
import { useTranslation } from '../contexts/Localization'
import useGelatoLimitOrdersLib from './limitOrders/useGelatoLimitOrdersLib'

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount,
  spender?: string,
): [ApprovalState, () => Promise<void>] {
  const { account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { t } = useTranslation()
  const { toastError } = useToast()
  const token = amountToApprove instanceof TokenAmount ? amountToApprove.token : undefined
  const currentAllowance = useTokenAllowance(token, account ?? undefined, spender)
  const pendingApproval = useHasPendingApproval(token?.address, spender)

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    if (amountToApprove.currency === ETHER) return ApprovalState.APPROVED
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

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      toastError(t('Error'), t('Approve was called unnecessarily'))
      console.error('approve was called unnecessarily')
      return
    }
    if (!token) {
      toastError(t('Error'), t('No token'))
      console.error('no token')
      return
    }

    if (!tokenContract) {
      toastError(t('Error'), t('Cannot find contract of the token %tokenAddress%', { tokenAddress: token?.address }))
      console.error('tokenContract is null')
      return
    }

    if (!amountToApprove) {
      toastError(t('Error'), t('Missing amount to approve'))
      console.error('missing amount to approve')
      return
    }

    if (!spender) {
      toastError(t('Error'), t('No spender'))
      console.error('no spender')
      return
    }

    let useExact = false

    const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
      // general fallback for tokens who restrict approval amounts
      useExact = true
      return tokenContract.estimateGas.approve(spender, amountToApprove.raw.toString())
    })

    // eslint-disable-next-line consistent-return
    return callWithGasPrice(
      tokenContract,
      'approve',
      [spender, useExact ? amountToApprove.raw.toString() : MaxUint256],
      {
        gasLimit: calculateGasMargin(estimatedGas),
      },
    )
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: `Approve ${amountToApprove.currency.symbol}`,
          approval: { tokenAddress: token.address, spender },
          type: 'approve',
        })
      })
      .catch((error: any) => {
        logError(error)
        console.error('Failed to approve token', error)
        if (error?.code !== 4001) {
          toastError(t('Error'), error.message)
        }
        throw error
      })
  }, [approvalState, token, tokenContract, amountToApprove, spender, addTransaction, callWithGasPrice, t, toastError])

  return [approvalState, approve]
}

// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTrade(trade?: Trade, allowedSlippage = 0) {
  const amountToApprove = useMemo(
    () => (trade ? computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT] : undefined),
    [trade, allowedSlippage],
  )

  return useApproveCallback(amountToApprove, ROUTER_ADDRESS[CHAIN_ID])
}

// Wraps useApproveCallback in the context of a Gelato Limit Orders
export function useApproveCallbackFromInputCurrencyAmount(currencyAmountIn: CurrencyAmount | undefined) {
  const gelatoLibrary = useGelatoLimitOrdersLib()

  return useApproveCallback(currencyAmountIn, gelatoLibrary?.erc20OrderRouter.address ?? undefined)
}
