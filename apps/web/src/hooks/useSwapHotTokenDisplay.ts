import { ChainId } from '@pancakeswap/sdk'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { useAtom } from 'jotai'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'
import { useActiveChainId } from './useActiveChainId'

const isSwapHotTokenDisplay = atomWithStorageWithErrorCatch<boolean>('pcs:isHotTokensDisplay', false)
const isSwapHotTokenDisplayETH = atomWithStorageWithErrorCatch<boolean>('pcs:isHotTokensDisplayETH', true)

export const useSwapHotTokenDisplay = () => {
  const { chainId } = useActiveChainId()
  const { isMobile } = useMatchBreakpoints()
  return useAtom(chainId === ChainId.BSC || isMobile ? isSwapHotTokenDisplay : isSwapHotTokenDisplayETH)
}
