import { ChainId } from '@pancakeswap/sdk'
import { MultiChainName } from '../state/info/constant'

export const getChainNameFromId = (chainId: number): MultiChainName => {
  const chainName = chainId ? (chainId === ChainId.BSC ? 'BSC' : chainId === ChainId.ETHEREUM ? 'ETH' : null) : null
  return chainName
}
