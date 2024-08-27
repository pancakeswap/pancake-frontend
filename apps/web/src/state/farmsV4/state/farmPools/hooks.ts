import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { farmPoolsAtom } from './atom'
import { fetchFarmPools } from './fetcher'

export const useFarmPools = () => {
  const [loaded, setLoaded] = useState(false)
  const [pools, setPools] = useAtom(farmPoolsAtom)

  useEffect(() => {
    if (!loaded) {
      fetchFarmPools()
        .then(setPools)
        .finally(() => setLoaded(true))
    }
    // only fetch once when mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { loaded, data: pools }
}
