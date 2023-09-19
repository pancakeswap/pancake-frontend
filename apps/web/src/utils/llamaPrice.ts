import { ChainId } from '@pancakeswap/chains'

const CHAIN_MAPPING = {
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.BSC]: 'bsc',
  [ChainId.ARBITRUM_ONE]: 'arbitrum',
  [ChainId.ZKSYNC]: 'era',
  [ChainId.LINEA]: 'linea',
  [ChainId.BASE]: 'base',
  [ChainId.POLYGON_ZKEVM]: 'polygon_zkevm',
} as const satisfies Record<number, string>

// use for fetch usd outside of the liquidity pools on PancakeSwap
export const fetchTokenUSDValue = async (chainId: number, tokenAddresses: string[]) => {
  if (!tokenAddresses.length || !CHAIN_MAPPING[chainId]) return new Map<string, string>()

  const list = tokenAddresses.map((address) => `${CHAIN_MAPPING[chainId]}:${address}`).join(',')

  const result: { coins: { [key: string]: { price: string } } } = await fetch(
    `https://coins.llama.fi/prices/current/${list}`,
  ).then((res) => res.json())

  const commonTokenUSDValue = new Map<string, string>()

  Object.entries(result.coins || {}).forEach(([key, value]) => {
    const [, address] = key.split(':')
    commonTokenUSDValue.set(address, value.price)
  })

  return commonTokenUSDValue
}
