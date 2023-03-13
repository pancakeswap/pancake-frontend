import { ChainId } from '@pancakeswap/sdk'
import { bscTokens } from '@pancakeswap/tokens'
import useTokenBalance from 'hooks/useTokenBalance'
import getLpAddress from 'utils/getLpAddress'
import { oldSTGTokenOnBSC } from './constants'

export function useHasSTGLP() {
  const lpSTGUSDTAddress = getLpAddress(bscTokens.usdt, oldSTGTokenOnBSC, ChainId.BSC)
  const lpSTGBUSDAddress = getLpAddress(bscTokens.busd, oldSTGTokenOnBSC, ChainId.BSC)

  const { balance: balanceSTGUSDT } = useTokenBalance(lpSTGUSDTAddress)
  const { balance: balanceSTGBUSD } = useTokenBalance(lpSTGBUSDAddress)
  // STG farm on ETH
  const { balance: balanceSTGUSDC } = useTokenBalance('0x6cCA86CC27EB8c7C2d10B0672FE392CFC88e62ff')

  return balanceSTGUSDT.gt(0) || balanceSTGBUSD.gt(0) || balanceSTGUSDC.gt(0)
}
