import { ChainId } from '@pancakeswap/sdk'
import { bscTokens } from '@pancakeswap/tokens'
import useTokenBalance from 'hooks/useTokenBalance'
import getLpAddress from 'utils/getLpAddress'
import { oldSTGTokenOnBSC } from './constants'

export function useHasSTGLP() {
  const lpAddress = getLpAddress(bscTokens.usdt, oldSTGTokenOnBSC, ChainId.BSC)

  const { balance } = useTokenBalance(lpAddress)

  return balance.gt(0)
}
