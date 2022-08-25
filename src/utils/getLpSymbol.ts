export const getLPSymbol = (token0Symbol: string, token1Symbol: string) => {
  if (token0Symbol === 'WBNB') {
    return `BNB-${token1Symbol} LP`
  }
  if (token0Symbol === 'WETH') {
    return `ETH-${token1Symbol} LP`
  }
  if (token1Symbol === 'WBNB') {
    return `${token0Symbol}-BNB LP`
  }
  if (token1Symbol === 'WETH') {
    return `${token0Symbol}-ETH LP`
  }
  return `${token0Symbol}-${token1Symbol} LP`
}
