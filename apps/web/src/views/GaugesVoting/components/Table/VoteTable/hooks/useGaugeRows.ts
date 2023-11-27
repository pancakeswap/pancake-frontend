import { usePreviousValue } from '@pancakeswap/hooks'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { GaugeVoting, useGaugesVoting } from 'views/GaugesVoting/hooks/useGaugesVoting'
import { useUserVoteGauges } from 'views/GaugesVoting/hooks/useUserVoteGuages'

export const useGaugeRows = () => {
  const gauges = useGaugesVoting()
  const { account } = useAccountActiveChain()
  const previousAccount = usePreviousValue(account)
  const { data: prevVotedGauges, refetch } = useUserVoteGauges()
  const [selectRowsHash, setSelectRowsHash] = useState<GaugeVoting['hash'][]>([])
  const rows = useMemo(() => {
    return gauges?.filter((gauge) => selectRowsHash.includes(gauge.hash))
  }, [gauges, selectRowsHash])

  useEffect(() => {
    if (account !== previousAccount) {
      setSelectRowsHash([])
    }
  }, [account, previousAccount, selectRowsHash])

  // add all gauges to selectRows when user has voted gauges
  useEffect(() => {
    if (prevVotedGauges?.length && !selectRowsHash.length) {
      setSelectRowsHash(prevVotedGauges.map((gauge) => gauge.hash))
    }
  }, [prevVotedGauges, selectRowsHash.length])

  const onRowSelect = useCallback(
    (hash: GaugeVoting['hash']) => {
      if (selectRowsHash.includes(hash)) {
        setSelectRowsHash((prev) => prev.filter((v) => v !== hash))
      } else {
        setSelectRowsHash((prev) => [...prev, hash])
      }
    },
    [selectRowsHash],
  )

  return {
    rows,
    onRowSelect,
    refetch,
  }
}
