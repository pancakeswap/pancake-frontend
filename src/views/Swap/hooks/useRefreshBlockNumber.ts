import { useState, useCallback, useEffect } from 'react'
import { useSWRConfig } from 'swr'

export const useRefreshBlockNumber = () => {
  const [isLoading, setFetch] = useState(false)

  const refreshBlockNumber = useCallback(() => {
    if (!isLoading) {
      setFetch(true)
    }
  }, [isLoading])

  const { mutate } = useSWRConfig()

  useEffect(() => {
    if (!isLoading) return

    mutate(['blockNumber'])

    // setTimeout is used to demonstrate the loading
    // because the real loading state occurs on multicall state
    // we don't know when the fetch is finished.
    setTimeout(() => setFetch(false), 500)
  }, [mutate, isLoading])

  return { refreshBlockNumber, isLoading }
}

export default useRefreshBlockNumber
