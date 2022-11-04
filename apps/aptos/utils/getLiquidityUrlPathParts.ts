const getLiquidityUrlPathParts = ({
  quoteTokenAddress,
  tokenAddress,
}: {
  quoteTokenAddress: string
  tokenAddress: string
}): string => {
  return `${quoteTokenAddress}/${tokenAddress}`
}

export default getLiquidityUrlPathParts
