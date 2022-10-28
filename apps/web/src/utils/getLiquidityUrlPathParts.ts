// Constructing the two forward-slash-separated parts of the 'Add Liquidity' URL
// Each part of the url represents a different side of the LP pair.
import { NATIVE, WNATIVE } from '@pancakeswap/sdk'

const getLiquidityUrlPathParts = ({
  quoteTokenAddress,
  tokenAddress,
  chainId,
}: {
  quoteTokenAddress: string
  tokenAddress: string
  chainId: number
}): string => {
  const wNativeAddress = WNATIVE[chainId]
  const firstPart =
    !quoteTokenAddress || quoteTokenAddress === wNativeAddress?.address ? NATIVE[chainId].symbol : quoteTokenAddress
  const secondPart = !tokenAddress || tokenAddress === wNativeAddress?.address ? NATIVE[chainId].symbol : tokenAddress
  return `${firstPart}/${secondPart}?chainId=${chainId}`
}

export default getLiquidityUrlPathParts
