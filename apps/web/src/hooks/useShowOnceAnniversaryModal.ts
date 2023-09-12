/* eslint-disable react-hooks/rules-of-hooks */
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const anniversaryModal = atomWithStorage('pcs:third-anniversary-modal', true)

export function useShowOnceAnniversaryModal() {
  return useAtom(anniversaryModal)
}
