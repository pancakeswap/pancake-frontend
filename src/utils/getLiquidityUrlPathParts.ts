// Constructing the two forward-slash-separated parts of the 'Add Liquidity' URL
// Each part of the url represents a different side of the LP pair.
import { getWbnbAddress } from './addressHelpers'

const getLiquidityUrlPathParts = ({
  quoteTokenAddress,
  tokenAddress,
}: {
  quoteTokenAddress: string
  tokenAddress: string
}): string => {
  const wBNBAddressString = getWbnbAddress()
  const firstPart = !quoteTokenAddress || quoteTokenAddress === wBNBAddressString ? 'BNB' : quoteTokenAddress
  const secondPart = !tokenAddress || tokenAddress === wBNBAddressString ? 'BNB' : tokenAddress
  return `${firstPart}/${secondPart}`
}

export default getLiquidityUrlPathParts
