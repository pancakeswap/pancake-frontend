const getLiquidityUrlPathParts = ({
  quoteTokenAddress,
  tokenAddress,
}: {
  quoteTokenAddress: string
  tokenAddress: string
}): string => {
  // TODO: Aptos Farm
  // const wBnbAddress = bscTokens.wbnb.address
  // const firstPart = !quoteTokenAddress || quoteTokenAddress === APTOS_COIN ? 'APT' : quoteTokenAddress
  // const secondPart = !tokenAddress || tokenAddress === APTOS_COIN ? 'APT' : tokenAddress
  // return `${firstPart}/${secondPart}`
  return `${quoteTokenAddress}/${tokenAddress}`
}

export default getLiquidityUrlPathParts
