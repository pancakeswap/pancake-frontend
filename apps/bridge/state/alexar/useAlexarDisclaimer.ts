import { useAtom } from 'jotai'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'

const ALEXAR_DISCLAIMER = 'pcs-bridge:alexar-disclaimer'

const useAlexarDisclaimer = atomWithStorageWithErrorCatch<boolean>(ALEXAR_DISCLAIMER, false)

export function useAcceptAlexarDisclaimer() {
  return useAtom(useAlexarDisclaimer)
}
