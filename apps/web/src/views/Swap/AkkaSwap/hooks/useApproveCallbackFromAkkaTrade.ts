import { TransactionResponse } from '@ethersproject/providers'
import { useCallback, useMemo } from 'react'
import useTokenAllowanceFromAkka from './useTokenAllowanceFromAkka'
import { useTransactionAdder, useHasPendingApproval } from 'state/transactions/hooks'
import { useTokenContract } from 'hooks/useContract'
import { BigNumber, ethers } from 'ethers'
import { useDispatch } from 'react-redux'
import { Contract, CallOverrides } from '@ethersproject/contracts'
import { get } from 'lodash'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ROUTER_ADDRESS } from 'config/constants/exchange'
import { useAkkaCallWithoutGasPrice } from './useAkkaCallWithoutGasPrice'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { Currency } from '@pancakeswap/sdk'
export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns'
export type ApproveParams = (spender: string, amountToApprove: BigNumber) => Promise<void>
export function useApproveCallback(
  tokenAddress?: string,
  amountToApprove?: BigNumber,
  spender?: string,
): [ApprovalState, () => Promise<void>] {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const token = amountToApprove
  const currentAllowance = useTokenAllowanceFromAkka(tokenAddress, account ?? undefined, spender)

  const pendingApproval = useHasPendingApproval(tokenAddress, spender)
  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) {
      return ApprovalState.UNKNOWN
    }
    // if (amountToApprove.currency === ETHER) return ApprovalState.APPROVED;
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) {
      return ApprovalState.UNKNOWN
    }
    return currentAllowance.lt(amountToApprove)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, pendingApproval, spender])

  const tokenContract = useTokenContract(tokenAddress)
  const addTransaction = useTransactionAdder()
  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.log('Error', 'Approve was called unnecessarily')
      console.error('approve was called unnecessarily')
      return
    }
    if (!token) {
      console.log('Error', 'No token')
      console.error('no token')
      return
    }

    if (!tokenContract) {
      console.log('Error', 'Cannot find contract of the token %tokenAddress%', {
        tokenAddress: tokenAddress,
      })
      console.error('tokenContract is null')
      return
    }

    if (!amountToApprove) {
      console.log('Error', 'Missing amount to approve')
      console.error('missing amount to approve')
      return
    }

    if (!spender) {
      console.log('Error', 'No spender')
      console.error('no spender')
      return
    }

    return callWithGasPrice(tokenContract, 'approve', [spender, amountToApprove] as Parameters<ApproveParams>, {
      gasLimit: 210000,
    })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: `Approve ${amountToApprove}`,
          approval: { tokenAddress: tokenAddress, spender },
          type: 'approve',
        })
      })
      .catch((error: any) => {
        console.error('Failed to approve token', error)
        if (error?.code !== 4001) {
          console.log('Error', error.message)
        }
        throw error
      })
  }, [approvalState, token, tokenContract, amountToApprove, spender, addTransaction])

  return [approvalState, approve]
}

// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromAkkaTrade(tokenAddress?: any, inputAmount?: string, allowedSlippage = 0) {
  const amountToApprove = useMemo(
    () => (inputAmount ? ethers.utils.parseUnits(inputAmount) : undefined),
    [inputAmount, allowedSlippage],
  )
  return useApproveCallback(tokenAddress?.address, amountToApprove, ROUTER_ADDRESS[32520])
}
