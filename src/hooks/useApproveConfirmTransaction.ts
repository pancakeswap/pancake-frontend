import { useReducer } from 'react'

type Web3Payload = Record<string, unknown> | null

type LoadingState = 'idle' | 'loading' | 'success' | 'fail'

type Action =
  | { type: 'approve_sending' }
  | { type: 'approve_receipt'; payload: Web3Payload }
  | { type: 'approve_error'; payload: Web3Payload }
  | { type: 'confirm_sending' }
  | { type: 'confirm_receipt'; payload: Web3Payload }
  | { type: 'confirm_error'; payload: Web3Payload }

type ContractHandler = () => any

interface State {
  approvalState: LoadingState
  approvalReceipt: Web3Payload
  approvalError: Web3Payload
  confirmState: LoadingState
  confirmReceipt: Web3Payload
  confirmError: Web3Payload
}

const initialState: State = {
  approvalState: 'idle',
  approvalReceipt: null,
  approvalError: null,
  confirmState: 'idle',
  confirmReceipt: null,
  confirmError: null,
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
        approvalReceipt: actions.payload,
      }
    case 'approve_error':
      return {
        ...state,
        approvalState: 'fail',
        approvalError: actions.payload,
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
        confirmReceipt: actions.payload,
      }
    case 'confirm_error':
      return {
        ...state,
        confirmState: 'fail',
        confirmError: actions.payload,
      }
    default:
      return state
  }
}
const useApproveConfirmTransaction = (onApprove: ContractHandler, onConfirm: ContractHandler) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return {
    isApproving: state.approvalState === 'loading',
    isApproved: state.approvalState === 'success',
    isConfirming: state.confirmState === 'loading',
    isConfirmed: state.confirmState === 'success',
    approvalReceipt: state.approvalReceipt,
    approvalError: state.approvalError,
    confirmReceipt: state.confirmReceipt,
    confirmError: state.confirmError,
    handleApprove: () => {
      onApprove()
        .on('sending', () => {
          dispatch({ type: 'approve_sending' })
        })
        .on('receipt', (payload: Web3Payload) => {
          dispatch({ type: 'approve_receipt', payload })
        })
        .on('error', (error: Web3Payload) => {
          dispatch({ type: 'approve_error', payload: error })
        })
    },
    handleConfirm: () => {
      onConfirm()
        .on('sending', () => {
          dispatch({ type: 'confirm_sending' })
        })
        .on('receipt', (payload: Web3Payload) => {
          dispatch({ type: 'confirm_receipt', payload })
        })
        .on('error', (error: Web3Payload) => {
          dispatch({ type: 'confirm_error', payload: error })
        })
    },
  }
}

export default useApproveConfirmTransaction
