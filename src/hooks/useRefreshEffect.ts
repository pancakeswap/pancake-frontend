import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
import { DependencyList, EffectCallback, useEffect, useMemo } from 'react'
import useSWR from 'swr'
import { EMPTY_ARRAY } from 'utils/constantObjects'

type BlockEffectCallback = (blockNumber: number) => ReturnType<EffectCallback>

const useDepsMemo = (blockNumber: number, deps?: DependencyList) => {
  const depsMemo = useMemo(
    () => [blockNumber, ...(deps || EMPTY_ARRAY)],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [blockNumber, ...(deps || EMPTY_ARRAY)],
  )

  return depsMemo
}

export function useFastRefreshEffect(effect: BlockEffectCallback, deps?: DependencyList) {
  const { data = 0 } = useSWR([FAST_INTERVAL, 'blockNumber'])
  const depsMemo = useDepsMemo(data, deps)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect.bind(null, data), depsMemo)
}

export function useSlowRefreshEffect(effect: BlockEffectCallback, deps?: DependencyList) {
  const { data = 0 } = useSWR([SLOW_INTERVAL, 'blockNumber'])
  const depsMemo = useDepsMemo(data, deps)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect.bind(null, data), depsMemo)
}
