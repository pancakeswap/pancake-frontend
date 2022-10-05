import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const userPoolsStakedOnlyAtom = atomWithStorage<boolean>('pcs:pools-staked-only', false)

export function usePoolsStakedOnly() {
  return useAtom(userPoolsStakedOnlyAtom)
}
