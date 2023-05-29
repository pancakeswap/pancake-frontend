import { ChainId } from '@pancakeswap/sdk'
import { TokenAddressMap } from '@pancakeswap/token-lists'

/**
 * An empty result, useful as a default.
 */
export const EMPTY_LIST: TokenAddressMap<ChainId> = {
  [ChainId.ETHEREUM]: {},
  [ChainId.GOERLI]: {},
  [ChainId.BSC]: {},
  [ChainId.BSC_TESTNET]: {},
  [ChainId.ARBITRUM_ONE]: {},
  [ChainId.ARBITRUM_GOERLI]: {},
  [ChainId.POLYGON_ZKEVM]: {},
  [ChainId.POLYGON_ZKEVM_TESTNET]: {},
  [ChainId.ZKSYNC]: {},
  [ChainId.ZKSYNC_TESTNET]: {},
  [ChainId.LINEA_TESTNET]: {},
}

export function serializeTokens(unserializedTokens: any) {
  const serializedTokens = Object.keys(unserializedTokens).reduce((accum, key) => {
    return { ...accum, [key]: unserializedTokens[key].serialize }
  }, {} as any)

  return serializedTokens
}
