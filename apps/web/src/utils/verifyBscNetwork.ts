import { ChainId } from '@pancakeswap/chains'

export const verifyBscNetwork = (chainId?: number) => {
  return Boolean(chainId && (chainId === ChainId.BSC || chainId === ChainId.BSC_TESTNET))
}
