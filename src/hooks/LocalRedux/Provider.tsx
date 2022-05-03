import { Reducer, Action } from '@reduxjs/toolkit'
import { createContext } from 'react'
import useReducerWithThunk from './useReducerWithThunk'

export const LocalContext = createContext(null)

interface TypeProps<StateType, ActionType> {
  children: React.ReactNode
  reducer: Reducer<StateType, Action<ActionType>>
  initialState: StateType
}

function LocalReduxProvider<StateType, ActionType>(props: TypeProps<StateType, ActionType>) {
  const { children, reducer, initialState } = props

  const [localState, localDispatch] = useReducerWithThunk<StateType, ActionType>(reducer, initialState)

  return <LocalContext.Provider value={{ localState, localDispatch }}>{children}</LocalContext.Provider>
}

export default LocalReduxProvider
