import { NATIVE, WNATIVE } from '@pancakeswap/sdk'

export const getTokenAddress = (chainId: number | undefined, tokenAddress: string | undefined) => {
  if (!tokenAddress || !chainId) {
    return ''
  }
  const lowerCaseAddress = tokenAddress.toLowerCase()
  const nativeToken = NATIVE[chainId]
  const nativeSymbol = nativeToken?.symbol?.toLowerCase() || ''
  if (lowerCaseAddress === nativeSymbol) {
    return WNATIVE[chainId].address
  }

  return lowerCaseAddress
}
