import { useAtom } from 'jotai'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'

const userUseMMLinkedPoolAtom = atomWithStorageWithErrorCatch<boolean>('pcs:useMMlinkedPool', true)

export function useMMLinkedPoolByDefault() {
  return useAtom(userUseMMLinkedPoolAtom)
}
