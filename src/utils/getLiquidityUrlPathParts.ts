// Constructing the two forward-slash-separated parts of the 'Add Liquidity' URL
// Each part of the url represents a different side of the LP pair.
const getLiquidityUrlPathParts = ({ quoteTokenAdresses, tokenAddresses }) => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  const firstPart = quoteTokenAdresses ? quoteTokenAdresses[chainId] : 'BNB'
  const secondPart = tokenAddresses ? tokenAddresses[chainId] : 'BNB'
  return `${firstPart}/${secondPart}`
}

export default getLiquidityUrlPathParts
