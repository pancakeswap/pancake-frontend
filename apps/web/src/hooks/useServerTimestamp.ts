import useSWRImmutable from 'swr/immutable'
import useSWR, { useSWRConfig } from 'swr'
import { useCallback } from 'react'
import { laggyMiddleware } from './useSWRContract'

const useServerTimestamp = () => {
  const { mutate } = useSWRConfig()
  const { data: lastCheck } = useSWRImmutable('serverTimestampLastCheck')

  const { data: serverTimestamp, error } = useSWR(
    'serverTimestamp',
    async () => {
      const res = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC', { method: 'GET', cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        mutate('serverTimestampLastCheck', Date.now(), { revalidate: false })
        return data.unixtime
      }
      throw new Error('Error when fetching api')
    },
    {
      use: [laggyMiddleware],
      revalidateIfStale: false,
      focusThrottleInterval: 60000,
    },
  )

  const getNowFallback = useCallback(() => Math.floor(Date.now() / 1000), [])

  const getNow = useCallback(() => {
    const timeDiffInSeconds = Math.round((Date.now() - lastCheck) / 1000)
    return lastCheck && serverTimestamp ? serverTimestamp + timeDiffInSeconds : null
  }, [lastCheck, serverTimestamp])

  return error ? getNowFallback : lastCheck && serverTimestamp ? getNow : null
}

export default useServerTimestamp
