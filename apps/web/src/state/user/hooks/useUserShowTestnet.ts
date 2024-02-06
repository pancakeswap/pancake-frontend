import { useAtom } from 'jotai'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'

const USER_SHOW_TESTNET = 'pcs:user-show-testnet'

const userShowTestnetAtom = atomWithStorageWithErrorCatch<boolean>(USER_SHOW_TESTNET, false)

export function useUserShowTestnet() {
  return useAtom(userShowTestnetAtom)
}
