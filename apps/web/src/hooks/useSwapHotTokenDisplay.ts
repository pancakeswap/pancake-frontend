import { ChainId } from '@pancakeswap/sdk'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useActiveChainId } from './useActiveChainId'

const isSwapHotTokenDisplay = atomWithStorage<boolean>('pcs:isHotTokensDisplay', false)
const isSwapHotTokenDisplayETH = atomWithStorage<boolean>('pcs:isHotTokensDisplayETH', true)

export const useSwapHotTokenDisplay = () => {
  const { chainId } = useActiveChainId()
  const { isMobile } = useMatchBreakpoints()
  return useAtom(chainId === ChainId.BSC || isMobile ? isSwapHotTokenDisplay : isSwapHotTokenDisplayETH)
}
