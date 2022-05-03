import { Action, Reducer } from '@reduxjs/toolkit'
import { useReducer, useCallback } from 'react'

export default function useReducerWithThunk<StateType, ActionType>(
  reducer: Reducer<StateType, Action<ActionType>>,
  initState: StateType,
) {
  const [state, dispatch] = useReducer(reducer, initState)

  const customDispatch = useCallback(
    (action: any) => {
      if (typeof action === 'function') {
        action(customDispatch)
      } else {
        dispatch(action)
      }
    },
    [dispatch],
  )

  return [state, customDispatch]
}
