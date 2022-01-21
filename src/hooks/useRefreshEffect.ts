import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
import { DependencyList, EffectCallback, useEffect, useMemo } from 'react'
import useSWR from 'swr'

export function useFastRefreshEffect(effect: EffectCallback, deps?: DependencyList) {
  const { data = 0 } = useSWR([FAST_INTERVAL, 'blockNumber'])
  const depsMemo = useMemo(() => [data, ...(deps || [])], [data, deps])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, depsMemo)
}

export function useSlowRefreshEffect(effect: EffectCallback, deps?: DependencyList) {
  const { data = 0 } = useSWR([SLOW_INTERVAL, 'blockNumber'])
  const depsMemo = useMemo(() => [data, ...(deps || [])], [data, deps])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, depsMemo)
}
