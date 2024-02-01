import { useState, useCallback, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useActiveChainId } from 'hooks/useActiveChainId'

export const useRefreshBlockNumber = () => {
  const [isLoading, setFetch] = useState(false)

  const refreshBlockNumber = useCallback(() => {
    if (!isLoading) {
      setFetch(true)
    }
  }, [isLoading])

  const queryClient = useQueryClient()
  const { chainId } = useActiveChainId()

  useEffect(() => {
    if (!isLoading) return

    queryClient.invalidateQueries({
      queryKey: ['blockNumberFetcher', chainId],
    })

    // setTimeout is used to demonstrate the loading
    // because the real loading state occurs on multicall state
    // we don't know when the fetch is finished.
    setTimeout(() => setFetch(false), 500)
  }, [queryClient, isLoading, chainId])

  return { refreshBlockNumber, isLoading }
}

export default useRefreshBlockNumber
