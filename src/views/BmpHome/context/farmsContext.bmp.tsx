import React, { createContext } from 'react'

export enum FarmsPage {
  Farms,
  History,
}
type Action = { type: 'setPage'; page: FarmsPage }
type Dispatch = (action: Action) => void
interface State {
  page: FarmsPage
}
type FarmsProviderProps = { children: React.ReactNode }

const FarmsContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined)

function FarmsReducer(state: State, action: Action) {
  switch (action.type) {
    case 'setPage':
      return { ...(state || {}), page: action.page }
    default:
      break
  }
  return state
}

function FarmsProvider({ children }: FarmsProviderProps) {
  const [state, dispatch] = React.useReducer(FarmsReducer, {
    page: FarmsPage.Farms,
  })
  const value = { state, dispatch }
  return <FarmsContext.Provider value={value}>{children}</FarmsContext.Provider>
}

function useFarms() {
  const context = React.useContext(FarmsContext)
  return context
}

export { FarmsProvider, useFarms }
