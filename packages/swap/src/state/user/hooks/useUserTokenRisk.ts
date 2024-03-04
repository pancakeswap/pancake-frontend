import { useAtom } from 'jotai'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'

const USER_TOKEN_RISK = 'pcs:user-token-risk'

const userTokenRiskAtom = atomWithStorageWithErrorCatch<boolean>(USER_TOKEN_RISK, true)

export function useUserTokenRisk() {
  return useAtom(userTokenRiskAtom)
}
