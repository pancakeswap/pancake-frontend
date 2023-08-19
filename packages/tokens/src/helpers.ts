import { ChainId } from '@pancakeswap/sdk'
import { enumValues } from '@pancakeswap/utils/enumValues'
import { TokenAddressMap } from '@pancakeswap/token-lists'

const createEmptyList = () => {
  const list = {} as Record<ChainId, TokenAddressMap<ChainId>[ChainId]>
  for (const chainId of enumValues(ChainId)) {
    list[chainId] = {}
  }
  return list as TokenAddressMap<ChainId>
}

/**
 * An empty result, useful as a default.
 */
export const EMPTY_LIST: TokenAddressMap<ChainId> = createEmptyList()

export function serializeTokens(unserializedTokens: any) {
  const serializedTokens = Object.keys(unserializedTokens).reduce((accum, key) => {
    return { ...accum, [key]: unserializedTokens[key].serialize }
  }, {} as any)

  return serializedTokens
}
