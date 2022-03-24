import React, { createContext } from 'react'

export enum LiquidityPage {
  Pool,
  Add,
  Remove,
  Find,
}
type Action = { type: 'setPage'; page: LiquidityPage } | { type: 'setCurrency'; currency1: string; currency2: string }
type Dispatch = (action: Action) => void
interface State {
  page: LiquidityPage
  currency1: string | null
  currency2: string | null
}
type LiquidityProviderProps = { children: React.ReactNode }

const LiquidityContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined)

function liquidityReducer(state: State, action: Action) {
  switch (action.type) {
    case 'setPage':
      return { ...(state || {}), page: action.page }
    case 'setCurrency':
      return { ...(state || {}), currency1: action.currency1, currency2: action.currency2 }
    default:
      break
  }
  return state
}

function LiquidityProvider({ children }: LiquidityProviderProps) {
  // @ts-ignore
  const [state, dispatch] = React.useReducer(liquidityReducer, {
    page: LiquidityPage.Pool,
    currency1: null,
    currency2: null,
  })
  const value = { state, dispatch }
  return <LiquidityContext.Provider value={value}>{children}</LiquidityContext.Provider>
}

function useLiquidity() {
  const context = React.useContext(LiquidityContext)
  return context
}

export { LiquidityProvider, useLiquidity }
