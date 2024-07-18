import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { farmPoolsAtom } from './atom'
import { fetchFarmPools } from './fetcher'

export const useFarmPools = () => {
  const [loading, setLoading] = useState(false)
  const [pools, setPools] = useAtom(farmPoolsAtom)

  useEffect(() => {
    if (!pools || !pools.length) {
      setLoading(true)
      fetchFarmPools()
        .then(setPools)
        .finally(() => setLoading(false))
    }
  }, [pools, setPools])

  return { loading, data: pools }
}
