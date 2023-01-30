import { useAtom } from 'jotai'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'

const userUseStableSwapAtom = atomWithStorageWithErrorCatch<boolean>('pcs:useStableSwap', true)

export function useStableSwapByDefault() {
  return useAtom(userUseStableSwapAtom)
}
