import { TransactionResponse } from '@pancakeswap/awgmi/core'
import noop from 'lodash/noop'
import { useReducer, useCallback } from 'react'

type LoadingState = 'idle' | 'loading' | 'success' | 'fail'

type Action = { type: 'confirm_sending' } | { type: 'confirm_receipt' } | { type: 'confirm_error' }

interface State {
  confirmState: LoadingState
}

const initialState: State = {
  confirmState: 'idle',
}

const reducer = (state: State, actions: Action): State => {
  switch (actions.type) {
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
  response: TransactionResponse
}

interface ConfirmTransaction {
  onConfirm: () => Promise<TransactionResponse>
  onSuccess: ({ state, response }: OnSuccessProps) => void
}

export const useConfirmTransaction = ({ onConfirm, onSuccess = noop }: ConfirmTransaction) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const handleConfirm = useCallback(async () => {
    dispatch({ type: 'confirm_sending' })
    const response = await onConfirm()

    if (response.hash) {
      dispatch({ type: 'confirm_receipt' })
      onSuccess({ state, response })
    } else {
      dispatch({ type: 'confirm_error' })
    }
  }, [onConfirm, dispatch, onSuccess, state])

  return {
    isConfirming: state.confirmState === 'loading',
    isConfirmed: state.confirmState === 'success',
    hasConfirmFailed: state.confirmState === 'fail',
    handleConfirm,
  }
}
