import { useAtom } from 'jotai'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'

const WORMHOLE_DISCLAIMER = 'pcs-bridge:wormhole-disclaimer'

const useWormholeDisclaimer = atomWithStorageWithErrorCatch<boolean>(WORMHOLE_DISCLAIMER, false)

export function useAcceptWormholeDisclaimer() {
  return useAtom(useWormholeDisclaimer)
}
