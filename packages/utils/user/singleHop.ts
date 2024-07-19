import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const userSingleHopAtom = atomWithStorage<boolean>('pcs:single-hop', false, undefined, {
  unstable_getOnInit: true,
})

export function useUserSingleHopOnly() {
  return useAtom(userSingleHopAtom)
}
