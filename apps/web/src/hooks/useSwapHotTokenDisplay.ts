import { ChainId } from '@pancakeswap/sdk'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useActiveChainId } from './useActiveChainId'

const isSwapHotTokenDisplay = atomWithStorage<boolean>('pcs:isHotTokensDisplay', false)
const isSwapHotTokenDisplayETH = atomWithStorage<boolean>('pcs:isHotTokensDisplayETH', true)

export const useSwapHotTokenDisplay = () => {
  const { chainId } = useActiveChainId()
  return useAtom(chainId === ChainId.BSC ? isSwapHotTokenDisplay : isSwapHotTokenDisplayETH)
}
