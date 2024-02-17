import { useAtom } from 'jotai'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'

const STARGATE_DISCLAIMER = 'pcs-bridge:stargate-disclaimer'

const useStargateDisclaimer = atomWithStorageWithErrorCatch<boolean>(STARGATE_DISCLAIMER, false)

export function useAcceptStargateDisclaimer() {
  return useAtom(useStargateDisclaimer)
}
