import { createContext, useContext, useState } from 'react'
import useABTestResult from 'hooks/useABTestResult'

interface ABTestingProviderProps {
  children: React.ReactNode
  useDeterministicResult: string | undefined
}

type ABTestingContextType = {
  aBTestResult: number
  useABTestResult: <T extends number>(
    userDeterministicResult: number,
    probabilityThreshold: T,
  ) => {
    isUserResultBelowThreshold: boolean
  }
}

const ABTestingContextManager = createContext({} as ABTestingContextType)

function ABTestingManagerProvider({ useDeterministicResult, children }: ABTestingProviderProps) {
  const [aBTestResult] = useState<number>(Number(useDeterministicResult) ?? 0)

  return (
    <ABTestingContextManager.Provider value={{ aBTestResult, useABTestResult }}>
      {children}
    </ABTestingContextManager.Provider>
  )
}

const useABTestingManager = () => {
  return useContext(ABTestingContextManager)
}

export { ABTestingManagerProvider, useABTestingManager }
