import React, { useEffect, useReducer, useRef, useCallback } from 'react'
import noop from 'lodash/noop'
import { useWeb3React } from '@web3-react/core'
import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'
import { logError } from 'utils/sentry'
import { ToastDescriptionWithTx } from 'components/Toast'

type LoadingState = 'idle' | 'loading' | 'success' | 'fail'

type Action =
  | { type: 'requires_approval' }
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
    case 'requires_approval':
      return {
        ...state,
        approvalState: 'success',
      }
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

interface ApproveConfirmTransaction {
  onApprove: () => Promise<TransactionResponse>
  onConfirm: (params?) => Promise<TransactionResponse>
  onRequiresApproval?: () => Promise<boolean>
  onSuccess: ({ state, receipt }: OnSuccessProps) => void
  onApproveSuccess?: ({ state, receipt }: OnSuccessProps) => void
}

const useApproveConfirmTransaction = ({
  onApprove,
  onConfirm,
  onRequiresApproval,
  onSuccess = noop,
  onApproveSuccess = noop,
}: ApproveConfirmTransaction) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [state, dispatch] = useReducer(reducer, initialState)
  const handlePreApprove = useRef(onRequiresApproval)
  const { toastSuccess, toastError } = useToast()

  const handleApprove = useCallback(async () => {
    try {
      const tx = await onApprove()
      toastSuccess(`${t('Transaction Submitted')}!`, <ToastDescriptionWithTx txHash={tx.hash} />)
      dispatch({ type: 'approve_sending' })
      const receipt = await tx.wait()
      if (receipt.status) {
        dispatch({ type: 'approve_receipt' })
        onApproveSuccess({ state, receipt })
      }
    } catch (error) {
      dispatch({ type: 'approve_error' })
      logError(error)
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    }
  }, [toastSuccess, onApprove, t, onApproveSuccess, state, toastError])

  const handleConfirm = useCallback(
    async (params = {}) => {
      dispatch({ type: 'confirm_sending' })
      try {
        const tx = await onConfirm(params)
        toastSuccess(`${t('Transaction Submitted')}!`, <ToastDescriptionWithTx txHash={tx.hash} />)
        const receipt = await tx.wait()
        if (receipt.status) {
          dispatch({ type: 'confirm_receipt' })
          onSuccess({ state, receipt })
        }
      } catch (error) {
        dispatch({ type: 'confirm_error' })
        logError(error)
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      }
    },
    [onConfirm, dispatch, onSuccess, state, t, toastError, toastSuccess],
  )

  // Check if approval is necessary, re-check if account changes
  useEffect(() => {
    if (account && handlePreApprove.current) {
      handlePreApprove.current().then((result) => {
        if (result) {
          dispatch({ type: 'requires_approval' })
        }
      })
    }
  }, [account, handlePreApprove, dispatch])

  return {
    isApproving: state.approvalState === 'loading',
    isApproved: state.approvalState === 'success',
    isConfirming: state.confirmState === 'loading',
    isConfirmed: state.confirmState === 'success',
    hasApproveFailed: state.approvalState === 'fail',
    hasConfirmFailed: state.confirmState === 'fail',
    handleApprove,
    handleConfirm,
  }
}

export default useApproveConfirmTransaction
