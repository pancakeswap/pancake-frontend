import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { isClient } from './isClient'

export const userSingleHopAtom = atomWithStorage<boolean>(
  'pcs:single-hop',
  false,
  undefined,
  isClient ? { unstable_getOnInit: true } : undefined,
)

export function useUserSingleHopOnly() {
  return useAtom(userSingleHopAtom)
}
