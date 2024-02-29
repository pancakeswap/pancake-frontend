import { useAtom } from 'jotai'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'

const ENABLE_WORMHOLE_MAINNET = 'pcs-bridge:enable-wormhole-mainnet'

const uenableWormholeMainnetAtom = atomWithStorageWithErrorCatch<boolean>(ENABLE_WORMHOLE_MAINNET, true)

export function useEnableWormholeMainnet() {
  return useAtom(uenableWormholeMainnetAtom)
}
