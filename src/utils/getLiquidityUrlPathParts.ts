// Constructing the two forward-slash-separated parts of the 'Add Liquidity' URL
// Each part of the url represents a different side of the LP pair.
import { getWbnbAddress } from './addressHelpers'

const getLiquidityUrlPathParts = ({ quoteTokenAddress, tokenAddress }) => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  const wBNBAddressString = getWbnbAddress()
  const quoteTokenAddressString = quoteTokenAddress !== undefined ? quoteTokenAddress[chainId] : null
  const tokenAddressString = tokenAddress !== undefined ? tokenAddress[chainId] : null
  const firstPart =
    !quoteTokenAddressString || quoteTokenAddressString === wBNBAddressString ? 'BNB' : quoteTokenAddressString
  const secondPart = !tokenAddressString || tokenAddressString === wBNBAddressString ? 'BNB' : tokenAddressString
  return `${firstPart}/${secondPart}`
}

export default getLiquidityUrlPathParts
