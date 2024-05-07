import { watchAccount } from '@wagmi/core'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo } from 'react'
import { useConfig } from 'wagmi'

export const useUrlQueryGauge = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const config = useConfig()
  const onAccountChange = useCallback(
    (account, preAccount) => {
      if (!account.address && !preAccount.address) return

      if (router.isReady && account?.address !== preAccount?.address) {
        const query = new URLSearchParams(searchParams.toString())
        query.delete('gauge_hash')
        router.replace(router.pathname, { query: query.toString() }, { shallow: true })
      }
    },
    [router, searchParams],
  )
  useEffect(() => {
    const unwatch = watchAccount(config, {
      onChange: onAccountChange,
    })
    return () => unwatch()
  }, [config, onAccountChange, router, searchParams])

  return useMemo(() => {
    if (!router.isReady) {
      return null
    }

    const gaugeHashes = searchParams.getAll('gauge_hash')

    return gaugeHashes
  }, [router.isReady, searchParams])
}
