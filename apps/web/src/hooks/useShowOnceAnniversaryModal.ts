/* eslint-disable react-hooks/rules-of-hooks */
import { useAtom } from 'jotai'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'

const anniversaryModal = atomWithStorageWithErrorCatch('pcs:third-anniversary-modal', {})

export function useShowOnceAnniversaryModal() {
  return useAtom(anniversaryModal)
}
