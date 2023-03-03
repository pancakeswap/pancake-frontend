import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const userSingleHopAtom = atomWithStorage<boolean>('pcs:single-hop', false)

export function useUserSingleHopOnly() {
  return useAtom(userSingleHopAtom)
}
