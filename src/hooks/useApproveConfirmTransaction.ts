import { useEffect, useReducer, useRef } from 'react'
import { noop } from 'lodash'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'

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

interface ApproveConfirmTransaction {
  onApprove: () => ethers.providers.TransactionResponse
  onConfirm: () => ethers.providers.TransactionResponse
  onRequiresApproval?: () => Promise<boolean>
  onSuccess: (state: State) => void
  onApproveSuccess?: (state: State) => void
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
  const { toastError } = useToast()

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
    handleApprove: async () => {
      const tx = await onApprove()
      dispatch({ type: 'approve_sending' })
      const receipt = await tx.wait()
      if (receipt.status) {
        dispatch({ type: 'approve_receipt' })
        onApproveSuccess(state)
      } else {
        dispatch({ type: 'approve_error' })
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      }
    },
    handleConfirm: async () => {
      dispatch({ type: 'confirm_sending' })
      const tx = await onConfirm()
      const receipt = await tx.wait()
      if (receipt.status) {
        dispatch({ type: 'confirm_receipt' })
        onSuccess(state)
      } else {
        dispatch({ type: 'confirm_error' })
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      }
    },
  }
}

export default useApproveConfirmTransaction
