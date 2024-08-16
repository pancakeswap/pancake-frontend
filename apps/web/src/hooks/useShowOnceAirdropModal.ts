/* eslint-disable react-hooks/rules-of-hooks */
import { useAtom } from 'jotai'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'

const airdropModal = atomWithStorageWithErrorCatch('pcs:v3-airdrop-modal', false)

export function useShowOnceAirdropModal() {
  return useAtom(airdropModal)
}
