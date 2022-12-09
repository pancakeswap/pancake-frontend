import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const isSwapHotTokenDisplay = atomWithStorage<boolean>('pcs:isHotTokensDisplay', false)

export const useSwapHotTokenDisplay = () => {
  return useAtom(isSwapHotTokenDisplay)
}
