import { WNATIVE, NATIVE } from '@pancakeswap/sdk'

export const getLPSymbol = (token0Symbol: string, token1Symbol: string, chainId: number) => {
  if (token0Symbol === WNATIVE[chainId].symbol) {
    return `${NATIVE[chainId].symbol}-${token1Symbol} LP`
  }
  if (token1Symbol === WNATIVE[chainId].symbol) {
    return `${token0Symbol}-${NATIVE[chainId].symbol} LP`
  }
  return `${token0Symbol}-${token1Symbol} LP`
}
