import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const userSmartRouterAtom = atomWithStorage<boolean>('pcs:smartRouter', true)

export function useUserSmartRouter() {
  return useAtom(userSmartRouterAtom)
}
