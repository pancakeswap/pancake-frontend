const getAddLiquidityUrlPathParts = ({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses }) => {
   const firstPart = quoteTokenSymbol === "BNB" ? "ETH" : quoteTokenAdresses[process.env.REACT_APP_CHAIN_ID]
   const secondPart = tokenAddresses[process.env.REACT_APP_CHAIN_ID]
  return `${firstPart}/${secondPart}`
}

export default getAddLiquidityUrlPathParts
