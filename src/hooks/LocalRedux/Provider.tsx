import { createContext } from 'react'
import useReducerWithThunk from './useReducerWithThunk'

export const LocalContext = createContext(null)

export default ({ children, reducer, initialState }) => {
  const [localState, localDispatch] = useReducerWithThunk(reducer, initialState)

  return <LocalContext.Provider value={{ localState, localDispatch }}>{children}</LocalContext.Provider>
}
