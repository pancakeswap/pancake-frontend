import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const userUseStableSwapAtom = atomWithStorage<boolean>('pcs:useStableSwap', true)

export function useStableSwapByDefault() {
  return useAtom(userUseStableSwapAtom)
}
