import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const userShowWalletCoinsAtom = atomWithStorage<boolean>('pcs:user-show-wallet-coins', false)

export function useUserShowWalletCoins() {
  return useAtom(userShowWalletCoinsAtom)
}
