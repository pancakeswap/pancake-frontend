import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const userPrioritizedGasPriceAtom = atomWithStorage<boolean>('pcs:prioritized-gas-price', false)

export function useUserPrioritizedGasPrice() {
  return useAtom(userPrioritizedGasPriceAtom)
}
