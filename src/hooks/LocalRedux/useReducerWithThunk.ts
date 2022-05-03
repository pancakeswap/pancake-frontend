import { useReducer, useCallback } from 'react'

export default function useReducerWithThunk(reducer, initState) {
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
