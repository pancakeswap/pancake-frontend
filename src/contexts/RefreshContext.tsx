import useInterval from 'hooks/useInterval'
import useIsWindowVisible from 'hooks/useIsWindowVisible'
import React, { useState } from 'react'

export const FAST_INTERVAL = 10000
export const SLOW_INTERVAL = 60000

const createRefreshContext = (interval: number) => {
  const RefreshContext = React.createContext(0)
  return {
    Context: RefreshContext,
    Provider: ({ children }) => {
      const [count, setCount] = useState(0)

      useInterval(
        () => {
          setCount((c) => c + 1)
        },
        useIsWindowVisible ? interval : null,
        false,
      )

      return <RefreshContext.Provider value={count}>{children}</RefreshContext.Provider>
    },
  }
}

export const SlowRefresh = createRefreshContext(SLOW_INTERVAL)
export const FastRefresh = createRefreshContext(FAST_INTERVAL)

const RefreshContextProvider = ({ children }) => {
  return (
    <SlowRefresh.Provider>
      <FastRefresh.Provider>{children}</FastRefresh.Provider>
    </SlowRefresh.Provider>
  )
}

export { RefreshContextProvider }
