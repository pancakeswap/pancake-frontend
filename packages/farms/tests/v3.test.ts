import { ChainId, chainNames, isTestnetChainId } from '@pancakeswap/chains'
import { Pool } from '@pancakeswap/v3-sdk'
import groupBy from 'lodash/groupBy'
import { isAddressEqual } from 'viem'
import { describe, expect, it } from 'vitest'
import { priceHelperTokens } from '../constants/common'
import { farmsV3ConfigChainMap } from '../constants/v3'
import { supportedChainIdV3 } from '../src'
import { CommonPrice, getFarmsPrices } from '../src/fetchFarmsV3'

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
  Object.entries(farmsV3ConfigChainMap).forEach(([_chainId, farms]) => {
    if (!supportedChainIdV3.filter((id) => !isTestnetChainId(id)).includes(Number(_chainId))) return
    const chainId = Number(_chainId) as ChainId
    const tokenList = tokenListByChain[chainId]
    it(`${chainNames[chainId]}.ts have config in token-list`, () => {
      expect(tokenList).not.toBeUndefined()
    })

    const groups = groupBy(farms, 'pid')
    Object.entries(groups).forEach(([pid, c]) => {
      it(`${chainNames[chainId]}.ts farms with pid #${pid} should unique`, () => {
        expect(c.length).toBe(1)
      })
    })
    const lps = groupBy(farms, 'lpAddress')
    Object.entries(lps).forEach(([lpAddress, c]) => {
      it(`${chainNames[chainId]}.ts farms with lpAddress ${lpAddress} should unique`, () => {
        expect(c.length).toBe(1)
      })
    })

    farms.forEach((farm) => {
      it(`${chainNames[chainId]}.ts pid #${farm.pid} tokens should has correct chainId`, () => {
        expect(farm.token0.chainId).toBe(chainId)
        expect(farm.token1.chainId).toBe(chainId)
      })
      const token0InList = tokenList.tokens.find((t) => isAddressEqual(t.address, farm.token0.address))
      const token1InList = tokenList.tokens.find((t) => isAddressEqual(t.address, farm.token1.address))

      it(`${chainNames[chainId]}.ts pid #${farm.pid} tokens should add to tokenlist`, () => {
        expect(token0InList, `${farm.token0.symbol}#${farm.token0.address}`).toBeDefined()
        expect(token1InList, `${farm.token1.symbol}#${farm.token1.address}`).toBeDefined()
      })

      it(`${chainNames[chainId]}.ts pid #${farm.pid} should has correct lpAddress`, () => {
        expect(Pool.getAddress(farm.token, farm.quoteToken, farm.feeAmount)).toEqual(farm.lpAddress)
      })

      it(`${chainNames[chainId]}.ts pid #${farm.pid} should has correct token order`, () => {
        expect(farm.token0.sortsBefore(farm.token1)).toBeTruthy()
      })
    })

    const commonPrice: CommonPrice = {}
    for (const commonToken of priceHelperTokens[chainId as keyof typeof priceHelperTokens].list) {
      commonPrice[commonToken.address] = '1'
    }
    const farmPrices = getFarmsPrices(
      farms.map((f) => ({
        ...f,
        tokenPriceVsQuote: '1',
        lmPool: '0x',
        lmPoolLiquidity: '',
        multiplier: '',
        poolWeight: '',
      })),
      '30',
      commonPrice,
    )

    for (const farmPrice of farmPrices) {
      it(`${chainNames[chainId]}.ts should have correct farm price for token ${farmPrice.token.address}`, () => {
        expect(farmPrice.tokenPriceBusd).not.toEqual('0')
      })
      it(`${chainNames[chainId]}.ts should have correct farm price for quoteToken ${farmPrice.quoteToken.address}`, () => {
        expect(farmPrice.quoteTokenPriceBusd).not.toEqual('0')
      })
    }
  })
})
