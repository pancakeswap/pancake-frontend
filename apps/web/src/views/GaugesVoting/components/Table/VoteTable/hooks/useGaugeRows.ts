import { useState, useMemo, useEffect, useCallback } from 'react'
import { useGaugesVoting, GaugeVoting } from 'views/GaugesVoting/hooks/useGaugesVoting'
import { useUserVoteGauges } from 'views/GaugesVoting/hooks/useUserVoteGuages'

export const useGaugeRows = () => {
  const gauges = useGaugesVoting()
  const { data: prevVotedGauges, refetch } = useUserVoteGauges()
  const [selectRows, setSelectRows] = useState<GaugeVoting['hash'][]>([])
  const rows = useMemo(() => {
    return gauges?.filter((gauge) => selectRows.includes(gauge.hash))
  }, [gauges, selectRows])

  // add all gauges to selectRows when user has voted gauges
  useEffect(() => {
    if (prevVotedGauges?.length && !selectRows.length) {
      setSelectRows(prevVotedGauges.map((gauge) => gauge.hash))
    }
  }, [prevVotedGauges, selectRows.length])

  const onRowAdd = useCallback(
    (hash: GaugeVoting['hash']) => {
      if (selectRows.includes(hash)) {
        setSelectRows((prev) => prev.filter((v) => v !== hash))
      } else {
        setSelectRows((prev) => [...prev, hash])
      }
    },
    [selectRows],
  )

  return {
    rows,
    selectRows,
    onRowAdd,
    refetch,
  }
}
