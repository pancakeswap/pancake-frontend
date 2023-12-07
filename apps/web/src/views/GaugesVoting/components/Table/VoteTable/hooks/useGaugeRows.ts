import { Gauge } from '@pancakeswap/gauges'
import { usePreviousValue } from '@pancakeswap/hooks'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useGauges } from 'views/GaugesVoting/hooks/useGauges'
import { useUserVoteGauges } from 'views/GaugesVoting/hooks/useUserVoteGauges'

export const useGaugeRows = () => {
  const { data: gauges, isLoading } = useGauges()
  const { account } = useAccountActiveChain()
  const previousAccount = usePreviousValue(account)
  const { data: prevVotedGauges, refetch } = useUserVoteGauges()
  const [selectRowsHash, setSelectRowsHash] = useState<Gauge['hash'][]>([])
  const [initialed, setInitialed] = useState(false)
  const rows = useMemo(() => {
    return gauges?.filter((gauge) => selectRowsHash.includes(gauge.hash))
  }, [gauges, selectRowsHash])

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

  return {
    gauges,
    rows,
    isLoading,
    onRowSelect,
    refetch,
  }
}
