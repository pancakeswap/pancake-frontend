import { Gauge } from '@pancakeswap/gauges'
import { usePreviousValue } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useGauges } from 'views/GaugesVoting/hooks/useGauges'
import { useUserVoteGauges } from 'views/GaugesVoting/hooks/useUserVoteGauges'
import { useUrlQueryGauge } from './useUrlQueryGauge'

export const useGaugeRows = () => {
  const { data: gauges, isLoading } = useGauges()
  const { t } = useTranslation()
  const { account } = useAccountActiveChain()
  const previousAccount = usePreviousValue(account)
  const { data: prevVotedGauges, refetch } = useUserVoteGauges()
  const [selectRowsHash, setSelectRowsHash] = useState<Gauge['hash'][]>([])
  const [initialed, setInitialed] = useState(false)
  const queryHashes = useUrlQueryGauge()
  const [queryPresetHashes, queryNotFoundHashes] = useMemo(() => {
    if (!account) return [null, null]
    if (queryHashes && queryHashes.length && gauges && gauges.length) {
      return queryHashes.reduce(
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
    return [null, null]
  }, [account, queryHashes, gauges])
  const rows = useMemo(() => {
    return gauges?.filter((gauge) => selectRowsHash.includes(gauge.hash) || queryPresetHashes?.includes(gauge.hash))
  }, [gauges, selectRowsHash, queryPresetHashes])

  useEffect(() => {
    if (account !== previousAccount) {
      setInitialed(false)
      setSelectRowsHash([])
    }
  }, [account, previousAccount, selectRowsHash])

  // add all gauges to selectRows when user has voted gauges
  useEffect(() => {
    if (prevVotedGauges?.length && !selectRowsHash.length && !initialed) {
      setSelectRowsHash(prevVotedGauges.map((gauge) => gauge.hash))
      setInitialed(true)
    }
  }, [initialed, prevVotedGauges, selectRowsHash.length])

  const onRowSelect = useCallback(
    (hash: Gauge['hash']) => {
      if (selectRowsHash.includes(hash)) {
        setSelectRowsHash((prev) => prev.filter((v) => v !== hash))
      } else {
        setSelectRowsHash((prev) => [...prev, hash])
      }
    },
    [selectRowsHash],
  )

  const router = useRouter()
  useEffect(() => {
    if (router.isReady && queryPresetHashes?.length) {
      document.getElementById('vecake-vote-power')?.scrollIntoView()
    }
  }, [queryPresetHashes?.length, router.isReady])

  const { toastError } = useToast()
  const hasNotFoundHashes = useMemo(() => queryNotFoundHashes?.length, [queryNotFoundHashes?.length])
  useEffect(() => {
    if (router.isReady && hasNotFoundHashes) {
      toastError(t('Gauge Not Found'), t('Gauge can not be found using the hash passed via URL.'))
    }
  }, [hasNotFoundHashes, router.isReady, t, toastError])

  return {
    gauges,
    rows,
    isLoading,
    onRowSelect,
    refetch,
  }
}
