import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { atom, useAtom, useAtomValue } from 'jotai'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'

const isSwapHotTokenDisplay = atomWithStorageWithErrorCatch<boolean>('pcs:isHotTokensDisplay2', false)
const isHotTokensDisplayMobile = atom(false)

export const useSwapHotTokenDisplay = () => {
  const { isMobile } = useMatchBreakpoints()
  return useAtom(isMobile ? isHotTokensDisplayMobile : isSwapHotTokenDisplay)
}

export const useIsSwapHotTokenDisplayFlag = () => {
  return useAtomValue(isSwapHotTokenDisplay)
}
