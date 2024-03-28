import { ChainId } from '@pancakeswap/chains'

export const TWAP_SUPPORTED_CHAINS = [ChainId.BSC]

export const isTwapSupported = (chainId?: ChainId) => {
  return !chainId ? false : TWAP_SUPPORTED_CHAINS.includes(chainId)
}
