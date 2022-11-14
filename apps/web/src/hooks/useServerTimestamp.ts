import useSWRImmutable from 'swr/immutable'
import useSWR, { useSWRConfig } from 'swr'
import { useCallback } from 'react'

const useServerTimestamp = () => {
  const { mutate } = useSWRConfig()
  const { data: lastCheck } = useSWRImmutable('serverTimestampLastCheck')

  const { data: serverTimestamp } = useSWR(
    'serverTimestamp',
    async () => {
      const res = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC', { method: 'GET', cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        mutate('serverTimestampLastCheck', Date.now(), { revalidate: false })
        return data.unixtime
      }
      return null
    },
    {
      revalidateIfStale: false,
      focusThrottleInterval: 60000,
    },
  )

  const getNow = useCallback(() => {
    const timeDiffInSeconds = Math.round((Date.now() - lastCheck) / 1000)
    return lastCheck && serverTimestamp ? serverTimestamp + timeDiffInSeconds : null
  }, [lastCheck, serverTimestamp])

  return lastCheck && serverTimestamp ? getNow : null
}

export default useServerTimestamp
