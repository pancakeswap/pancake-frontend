import { subgraphTokenName, subgraphTokenSymbol } from 'state/info/constant'
import { safeGetAddress } from 'utils'

export const getTokenSymbolAlias = (
  address: string | undefined,
  chainId: number | undefined,
  defaultSymbol?: string,
): string | undefined => {
  const addr = safeGetAddress(address)
  if (!addr || !chainId) {
    return defaultSymbol
  }
  return subgraphTokenSymbol[chainId]?.[addr] ?? defaultSymbol
}

export const getTokenNameAlias = (
  address: string | undefined,
  chainId: number | undefined,
  defaultName?: string,
): string | undefined => {
  const addr = safeGetAddress(address)
  if (!addr || !chainId) {
    return defaultName
  }
  return subgraphTokenName[chainId]?.[addr] ?? defaultName
}
