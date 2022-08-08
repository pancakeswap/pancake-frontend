import { useCallback, useState } from 'react'
import usePreviousValue from './usePreviousValue'

/**
 * A helper hook to keep track of the time between events
 * Can also be used to force an effect to re-run
 */
const useLastUpdated = () => {
  const [lastUpdated, setStateLastUpdated] = useState(() => Date.now())
  const previousLastUpdated = usePreviousValue(lastUpdated)

  const setLastUpdated = useCallback(() => {
    setStateLastUpdated(Date.now())
  }, [setStateLastUpdated])

  return { lastUpdated, previousLastUpdated, setLastUpdated }
}

export default useLastUpdated
