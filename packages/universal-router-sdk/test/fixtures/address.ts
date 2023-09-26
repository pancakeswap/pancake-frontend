import { ChainId } from '@pancakeswap/chains'
import { CAKE, ETHER, USDC, USDT, WETH9 } from './constants/tokens'

export const fixtureAddresses = (chainId: ChainId) => {
  return {
    ETHER: ETHER.on(chainId),
    USDC: USDC[chainId],
    USDT: USDT[chainId],
    CAKE: CAKE[chainId],
    WETH: WETH9[chainId],
  }
}
