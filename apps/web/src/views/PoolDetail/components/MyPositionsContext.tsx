import BigNumber from 'bignumber.js'
import { createContext, PropsWithChildren, useCallback, useContext, useState } from 'react'

type MyPositionsContextState = {
  totalApr: {
    [key: string]: {
      denominator: BigNumber
      numerator: BigNumber
    }
  }
  updateTotalApr: (key: string, numerator: BigNumber, denominator: BigNumber) => void
}
const defaultState: MyPositionsContextState = {
  totalApr: {},
  updateTotalApr: () => {},
}
const MyPositionsContext = createContext<MyPositionsContextState>(defaultState)
export const MyPositionsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [totalApr, setTotalApr] = useState<{ [key: string]: { denominator: BigNumber; numerator: BigNumber } }>({})

  const updateTotalApr = useCallback((key: string, numerator: BigNumber, denominator: BigNumber) => {
    setTotalApr((prevState) => ({
      ...prevState,
      [key]: { numerator, denominator },
    }))
  }, [])

  return <MyPositionsContext.Provider value={{ totalApr, updateTotalApr }}>{children}</MyPositionsContext.Provider>
}

export const useMyPositions = () => useContext(MyPositionsContext)
