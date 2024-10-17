import { ChainId } from '@pancakeswap/chains'
import { describe } from 'vitest'

const tokenListMap = {
  [ChainId.BSC]: 'https://tokens.pancakeswap.finance/pancakeswap-extended.json',
  [ChainId.ETHEREUM]: 'https://tokens.pancakeswap.finance/pancakeswap-eth-default.json',
  [ChainId.ZKSYNC]: 'https://tokens.pancakeswap.finance/pancakeswap-zksync-default.json',
  [ChainId.POLYGON_ZKEVM]: 'https://tokens.pancakeswap.finance/pancakeswap-polygon-zkevm-default.json',
  [ChainId.ARBITRUM_ONE]: 'https://tokens.pancakeswap.finance/pancakeswap-arbitrum-default.json',
  [ChainId.LINEA]: 'https://tokens.pancakeswap.finance/pancakeswap-linea-default.json',
  [ChainId.BASE]: 'https://tokens.pancakeswap.finance/pancakeswap-base-default.json',
  [ChainId.OPBNB]: 'https://tokens.pancakeswap.finance/pancakeswap-opbnb-default.json',
} as const

describe('Config farms V3', async () => {
  const tokenListByChain = {} as Record<number, any>

  await Promise.all(
    Object.entries(tokenListMap).map(async ([_chainId, url]) => {
      const chainId = Number(_chainId)
      try {
        const resp = await fetch(url)
        const json = await resp.json()
        tokenListByChain[chainId] = json
      } catch (error) {
        console.error('chainId', url, error)
        throw error
      }
    }),
  )
})
