import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const USER_TOKEN_RISK = 'pcs:user-token-risk'

const userTokenRiskAtom = atomWithStorage<boolean>(USER_TOKEN_RISK, true)

export function useUserTokenRisk() {
  return useAtom(userTokenRiskAtom)
}
