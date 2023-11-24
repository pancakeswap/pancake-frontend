import { FEATURE_FLAGS } from 'contexts/ABTestingContext/config'
import { createContext, useCallback, useContext, useState } from 'react'

interface ABTestingProviderProps {
  children: React.ReactNode
  ABTestUserResults: { [flag in FEATURE_FLAGS]: boolean }
}

type ABTestingContextType = {
  featureFlagResults: { [flag in FEATURE_FLAGS]: boolean }
  selectUserfeatureABResult: (flagKey: FEATURE_FLAGS) => boolean
}

const ABTestingContextManager = createContext({} as ABTestingContextType)

function ABTestingManagerProvider({ ABTestUserResults, children }: ABTestingProviderProps) {
  const [featureFlagResults] = useState<{ [flag in FEATURE_FLAGS]: boolean }>(ABTestUserResults)

  const selectUserfeatureABResult = useCallback(
    (flagKey: FEATURE_FLAGS) => {
      if (typeof featureFlagResults[flagKey] === 'undefined') return false
      return featureFlagResults[flagKey]
    },
    [featureFlagResults],
  )

  return (
    <ABTestingContextManager.Provider value={{ featureFlagResults, selectUserfeatureABResult }}>
      {children}
    </ABTestingContextManager.Provider>
  )
}

const useABTestingManager = () => {
  return useContext(ABTestingContextManager)
}

export { ABTestingManagerProvider, useABTestingManager }
