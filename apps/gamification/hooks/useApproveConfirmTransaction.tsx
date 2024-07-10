import { ERC20Token, MaxUint256 } from '@pancakeswap/sdk'
import noop from 'lodash/noop'
import { useCallback, useEffect, useReducer, useRef } from 'react'
import { Address, TransactionReceipt } from 'viem'
import { useAccount } from 'wagmi'
import { ApprovalState, useApproveCallbackFromAmount } from './useApproveCallback'
import useCatchTxError from './useCatchTxError'

type LoadingState = 'idle' | 'loading' | 'success' | 'fail'

type Action =
  | { type: 'approve_sending' }
  | { type: 'approve_receipt' }
  | { type: 'approve_error' }
  | { type: 'confirm_sending' }
  | { type: 'confirm_receipt' }
  | { type: 'confirm_error' }

interface State {
  approvalState: LoadingState
  confirmState: LoadingState
}

const initialState: State = {
  approvalState: 'idle',
  confirmState: 'idle',
}

const reducer = (state: State, actions: Action): State => {
  switch (actions.type) {
    case 'approve_sending':
      return {
        ...state,
        approvalState: 'loading',
      }
    case 'approve_receipt':
      return {
        ...state,
        approvalState: 'success',
      }
    case 'approve_error':
      return {
        ...state,
        approvalState: 'fail',
      }
    case 'confirm_sending':
      return {
        ...state,
        confirmState: 'loading',
      }
    case 'confirm_receipt':
      return {
        ...state,
        confirmState: 'success',
      }
    case 'confirm_error':
      return {
        ...state,
        confirmState: 'fail',
      }
    default:
      return state
  }
}

interface OnSuccessProps {
  state: State
  receipt: TransactionReceipt
}

type CustomApproveProps = {
  onRequiresApproval: () => Promise<boolean>
  onApprove: () => Promise<{ hash: Address } | undefined> | undefined
}

type ERC20TokenApproveProps = {
  token?: ERC20Token
  minAmount?: bigint
  targetAmount?: bigint
  spender?: Address
}

type ApproveConfirmTransaction = {
  onConfirm: (params?: any) => Promise<{ hash: Address }> | undefined
  onSuccess: ({ state, receipt }: OnSuccessProps) => void
  onApproveSuccess?: ({ state, receipt }: OnSuccessProps) => void
} & (CustomApproveProps | ERC20TokenApproveProps)

const useApproveConfirmTransaction = ({
  onConfirm,
  onSuccess = noop,
  onApproveSuccess = noop,
  ...props
}: ApproveConfirmTransaction) => {
  const { onApprove, onRequiresApproval } =
    props && 'onApprove' in props ? props : { onRequiresApproval: undefined, onApprove: undefined }
  const { minAmount, spender, token, targetAmount } =
    props && !('onApprove' in props)
      ? props
      : { minAmount: 0n, spender: undefined, token: undefined, targetAmount: MaxUint256 }

  const { address: account } = useAccount()
  const [state, dispatch] = useReducer(reducer, initialState)
  const handlePreApprove = useRef(onRequiresApproval)
  const { approvalState, approveCallback } = useApproveCallbackFromAmount({
    token: onRequiresApproval ? undefined : token,
    minAmount,
    targetAmount,
    spender,
    addToTransaction: false,
  })
  const { fetchWithCatchTxError } = useCatchTxError()

  const handleApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(async () => {
      dispatch({ type: 'approve_sending' })
      return onApprove ? onApprove() : approveCallback()
    })
    if (receipt?.status) {
      dispatch({ type: 'approve_receipt' })
      onApproveSuccess({ state, receipt })
    } else {
      dispatch({ type: 'approve_error' })
    }
  }, [fetchWithCatchTxError, onApprove, approveCallback, onApproveSuccess, state])

  const handleConfirm = useCallback(
    async (params = {}) => {
      const receipt = await fetchWithCatchTxError(async () => {
        dispatch({ type: 'confirm_sending' })
        return onConfirm(params)
      })
      if (receipt?.status) {
        dispatch({ type: 'confirm_receipt' })
        onSuccess({ state, receipt })
      } else {
        dispatch({ type: 'confirm_error' })
      }
    },
    [onConfirm, dispatch, onSuccess, state, fetchWithCatchTxError],
  )

  // Check if approval is necessary, re-check if account changes
  useEffect(() => {
    if (account && handlePreApprove.current) {
      handlePreApprove.current().then((requiresApproval) => {
        if (!requiresApproval) {
          dispatch({ type: 'approve_receipt' })
        }
      })
    }
  }, [account, handlePreApprove, dispatch])

  return {
    isApproving: state.approvalState === 'loading',
    isApproved: onApprove ? state.approvalState === 'success' : approvalState === ApprovalState.APPROVED,
    isConfirming: state.confirmState === 'loading',
    isConfirmed: state.confirmState === 'success',
    hasApproveFailed: onApprove ? state.approvalState === 'fail' : approvalState === ApprovalState.NOT_APPROVED,
    hasConfirmFailed: state.confirmState === 'fail',
    handleApprove,
    handleConfirm,
  }
}

export default useApproveConfirmTransaction
