import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'

export enum PositionManagerStatus {
  LIVE,
  FINISHED,
}

const LIVE_ROUTE = '/position-managers'
const FINISHED_ROUTE = `${LIVE_ROUTE}/history`

export function usePositionManagerStatus() {
  const router = useRouter()

  const pmStatus = useMemo(
    () => (router.pathname.endsWith('/history') ? PositionManagerStatus.FINISHED : PositionManagerStatus.LIVE),
    [router.pathname],
  )
  const setStatus = useCallback(
    (nextStatus: PositionManagerStatus) => {
      if (pmStatus === nextStatus) {
        return
      }
      router.push(nextStatus === PositionManagerStatus.LIVE ? LIVE_ROUTE : FINISHED_ROUTE)
    },
    [pmStatus, router],
  )

  return {
    status: pmStatus,
    setStatus,
  }
}
