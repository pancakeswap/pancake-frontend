import { Gauge } from '@pancakeswap/gauges'
import { watchAccount } from '@wagmi/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Hash } from 'viem'
import { useGauges } from 'views/GaugesVoting/hooks/useGauges'
import { useUserVoteGauges } from 'views/GaugesVoting/hooks/useUserVoteGauges'
import { useConfig } from 'wagmi'
import { useUrlQueryGauge } from './useUrlQueryGauge'

const useSelectRowsWithQuery = (gauges: Gauge[] | undefined) => {
  const [selectRowsHash, setSelectRowsHash] = useState<Gauge['hash'][]>([])
  const queryHashes = useUrlQueryGauge(gauges)
  const { data: prevVotedGauges, refetch, isLoading } = useUserVoteGauges()

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

  useEffect(() => {
    if (queryHashes && !isLoading) {
      setSelectRowsHash((hashes) => {
        const newAdded: Hash[] = []
        queryHashes.forEach((hash) => {
          if (!hashes.includes(hash)) {
            newAdded.push(hash)
          }
        })
        return newAdded.length ? newAdded.concat(hashes) : hashes
      })
    }
  }, [isLoading, queryHashes])

  const config = useConfig()
  // reset selectRowsHash when account change
  const onAccountChange = useCallback(
    (current, prev) => {
      if (!current.address && !prev.address) return
      if (current?.address !== prev?.address) {
        setSelectRowsHash([])
      }
    },
    [setSelectRowsHash],
  )

  useEffect(() => {
    const unwatch = watchAccount(config as any, {
      onChange: onAccountChange,
    })
    return () => unwatch()
  }, [config, onAccountChange])

  useEffect(() => {
    if (prevVotedGauges && !isLoading) {
      const newHashes = prevVotedGauges.map((gauge) => gauge.hash)
      const urlHashes = queryHashes.filter((hash) => !newHashes.includes(hash))
      setSelectRowsHash(urlHashes.concat(newHashes))
    }
  }, [isLoading, prevVotedGauges, queryHashes])

  return { selectRowsHash, setSelectRowsHash, onRowSelect, refetch, isLoading }
}

export const useGaugeRows = () => {
  const { data: gauges, isLoading: gaugeIsLoading } = useGauges()
  const { selectRowsHash, onRowSelect, refetch, isLoading: voteIsLoading } = useSelectRowsWithQuery(gauges)
  const rows = useMemo(() => {
    const gaugesMap = new Map(gauges?.map((gauge) => [gauge.hash, gauge]))

    return selectRowsHash.map((hash) => gaugesMap.get(hash)).filter(Boolean) as Gauge[]
  }, [gauges, selectRowsHash])
  const isLoading = useMemo(() => gaugeIsLoading && voteIsLoading, [gaugeIsLoading, voteIsLoading])

  return {
    gauges,
    rows,
    isLoading,
    onRowSelect,
    refetch,
  }
}
