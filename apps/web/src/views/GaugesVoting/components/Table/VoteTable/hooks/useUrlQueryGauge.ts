import { Gauge } from '@pancakeswap/gauges'
import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { watchAccount } from '@wagmi/core'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo } from 'react'
import { useConfig } from 'wagmi'

export const GAUGE_QUERY_KEY = 'gauge_hash'

export const useUrlQueryGauge = (gauges: Gauge[] | undefined) => {
  const { account } = useAccountActiveChain()
  const router = useRouter()
  const { toastError } = useToast()
  const { t } = useTranslation()

  const rawHashes = useMemo(() => {
    if (!router.query[GAUGE_QUERY_KEY]) return []
    if (Array.isArray(router.query[GAUGE_QUERY_KEY])) {
      return router.query[GAUGE_QUERY_KEY]
    }
    return [router.query[GAUGE_QUERY_KEY]]
  }, [router.query])
  const [validHashes, invalidHashes] = useMemo(() => {
    if (!account) return [[], []]
    if (rawHashes && rawHashes.length && gauges && gauges.length) {
      return rawHashes.reduce(
        (acc, hash) => {
          if (gauges.find((gauge) => gauge.hash === hash)) {
            acc[0].push(hash as Gauge['hash'])
          } else {
            acc[1].push(hash as Gauge['hash'])
          }
          return acc
        },
        [[], []] as [Gauge['hash'][], Gauge['hash'][]],
      )
    }
    return [[], []]
  }, [account, gauges, rawHashes])

  useEffect(() => {
    if (invalidHashes.length) {
      toastError(t('Gauge Not Found'), t('Gauge can not be found using the hash passed via URL.'))
    }
  }, [invalidHashes.length, t, toastError])

  useEffect(() => {
    if (router.isReady && validHashes.length) {
      document.getElementById('vecake-vote-power')?.scrollIntoView()
    }
  }, [router.isReady, validHashes.length])

  const config = useConfig()
  // remove query when account change
  const onAccountChange = useCallback(
    (nextAccount, preAccount) => {
      if (!nextAccount.address && !preAccount.address) return

      if (router.isReady && nextAccount?.address !== preAccount?.address) {
        const query = { ...router.query }
        delete query[GAUGE_QUERY_KEY]
        router.replace(router.pathname, { query }, { shallow: true })
      }
    },
    [router],
  )

  useEffect(() => {
    const unwatch = watchAccount(config as any, {
      onChange: onAccountChange,
    })
    return () => unwatch()
  }, [config, onAccountChange])

  return validHashes
}
