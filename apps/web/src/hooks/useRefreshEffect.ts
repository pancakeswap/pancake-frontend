import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
import { DependencyList, EffectCallback, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useActiveChainId } from './useActiveChainId'

type BlockEffectCallback = (blockNumber: number) => ReturnType<EffectCallback>

const EMPTY_ARRAY = []

export function useFastRefreshEffect(effect: BlockEffectCallback, deps?: DependencyList) {
  const { chainId } = useActiveChainId()
  const { data = 0 } = useQuery<number>([FAST_INTERVAL, 'blockNumber', chainId], { enabled: false })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect.bind(null, data), [data, ...(deps || EMPTY_ARRAY)])
}

export function useSlowRefreshEffect(effect: BlockEffectCallback, deps?: DependencyList) {
  const { chainId } = useActiveChainId()
  const { data = 0 } = useQuery<number>([SLOW_INTERVAL, 'blockNumber', chainId], { enabled: false })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect.bind(null, data), [data, ...(deps || EMPTY_ARRAY)])
}
