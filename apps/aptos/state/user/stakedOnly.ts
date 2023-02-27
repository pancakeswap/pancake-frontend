import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const userPoolsStakedOnlyAtom = atomWithStorage<boolean>('pcs:pools-staked-only', false)
const userFarmsStakedOnlyAtom = atomWithStorage<boolean>('pcs:aptos-farms-staked-only', false)

export function usePoolsStakedOnly() {
  return useAtom(userPoolsStakedOnlyAtom)
}

export function useFarmsStakedOnly() {
  return useAtom(userFarmsStakedOnlyAtom)
}
