import { ChainId, chainNames } from '@pancakeswap/chains'
import { Pool } from '@pancakeswap/v3-sdk'
import groupBy from 'lodash/groupBy'
import { describe, expect, it } from 'vitest'
import { priceHelperTokens } from '../constants/common'
import { farmsV3ConfigChainMap } from '../constants/v3'
import { CommonPrice, getFarmsPrices } from '../src/fetchFarmsV3'

describe('Config farms V3', () => {
  Object.entries(farmsV3ConfigChainMap).forEach(([_chainId, farms]) => {
    const chainId = Number(_chainId)
    if (
      ![
        ChainId.BSC,
        ChainId.ETHEREUM,
        ChainId.POLYGON_ZKEVM,
        ChainId.ZKSYNC,
        ChainId.ARBITRUM_ONE,
        ChainId.LINEA,
        ChainId.BASE,
      ].includes(chainId)
    )
      return
    const groups = groupBy(farms, 'pid')
    Object.entries(groups).forEach(([pid, c]) => {
      it(`${chainNames[chainId]}.ts farms with pid #${pid} should unique`, () => {
        expect(c.length).toBe(1)
      })
    })
    farms.forEach((farm) => {
      it(`${chainNames[chainId]}.ts pid #${farm.pid} tokens should has correct chainId`, () => {
        expect(farm.token0.chainId).toBe(chainId)
        expect(farm.token1.chainId).toBe(chainId)
      })

      it(`${chainNames[chainId]}.ts pid #${farm.pid} should has correct lpAddress`, () => {
        expect(Pool.getAddress(farm.token, farm.quoteToken, farm.feeAmount)).toEqual(farm.lpAddress)
      })

      it(`${chainNames[chainId]}.ts pid #${farm.pid} should has correct token order`, () => {
        expect(farm.token0.sortsBefore(farm.token1)).toBeTruthy()
      })
    })

    const commonPrice: CommonPrice = {}
    for (const commonToken of priceHelperTokens[chainId].list) {
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
