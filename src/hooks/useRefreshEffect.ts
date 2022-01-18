import { DependencyList, EffectCallback, useEffect, useMemo } from 'react'
import { useCurrentBlock, useSlowCurrentBlock } from 'state/block/hooks'

export function useFastRefreshEffect(effect: EffectCallback, deps?: DependencyList) {
  const currentBlock = useCurrentBlock()
  const depsMemo = useMemo(() => [currentBlock, ...(deps || [])], [currentBlock, deps])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, depsMemo)
}

export function useSlowRefreshEffect(effect: EffectCallback, deps?: DependencyList) {
  const slowCurrentBlock = useSlowCurrentBlock()
  const depsMemo = useMemo(() => [slowCurrentBlock, ...(deps || [])], [slowCurrentBlock, deps])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, depsMemo)
}
