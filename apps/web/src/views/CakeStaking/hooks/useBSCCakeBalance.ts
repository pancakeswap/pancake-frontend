import { ChainId } from '@pancakeswap/chains'
import { CAKE, bscTestnetTokens } from '@pancakeswap/tokens'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTokenBalance from 'hooks/useTokenBalance'
import { useMemo } from 'react'

// @notice: return only bsc or bsc-testnet cake token balance
export const useBSCCakeBalance = () => {
  const { chainId } = useActiveChainId()
  const cakeAddress = useMemo(() => {
    if (ChainId.BSC === chainId) return CAKE[chainId as ChainId].address
    if (ChainId.BSC_TESTNET === chainId) return bscTestnetTokens.cake2.address
    return undefined
  }, [chainId])
  const { balance } = useTokenBalance(cakeAddress)

  return balance
}
