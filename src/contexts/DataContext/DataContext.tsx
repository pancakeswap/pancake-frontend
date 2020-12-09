import React, { useReducer, useEffect } from 'react'
import farmsConfig from 'sushi/lib/constants/farms'
import fetchLps from './fetch/fetchLps'
import { State } from './types'

const actions = {
  FETCH_LP: 'fetchLiquidityPoolData',
}

const initialState: State = {
  farms: farmsConfig,
}

const reducer = (state, action) => {
  if (action.type === actions.FETCH_LP) {
    return { ...state, farms: action.payload }
  }

  return state
}

const DataContext = React.createContext({ data: initialState })

const DataContextProvider = ({ children }) => {
  const [data, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const fetch = async () => {
      const farms = await fetchLps()
      dispatch({ type: actions.FETCH_LP, payload: farms })
    }
    fetch()
  }, [])

  return <DataContext.Provider value={{ data }}>{children}</DataContext.Provider>
}

export { DataContext, DataContextProvider }
