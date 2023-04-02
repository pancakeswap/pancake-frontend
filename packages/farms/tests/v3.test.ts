import { ChainId } from '@pancakeswap/sdk'
import { CAKE } from '@pancakeswap/tokens'
import { Pool } from '@pancakeswap/v3-sdk'
import { describe, it, expect } from 'vitest'
import { farmsV3ConfigChainMap } from '../constants/v3'
import { priceHelperTokens } from '../constants/common'

const mainnetFarms = [farmsV3ConfigChainMap[ChainId.BSC], farmsV3ConfigChainMap[ChainId.ETHEREUM]]

function hasDuplicates(array: any[]) {
  return new Set(array).size !== array.length
}

describe('Config farms V3', () => {
  it.each(mainnetFarms)('All farm has an unique pid', (...farms) => {
    const pids = farms.map((farm) => farm.pid)
    expect(hasDuplicates(pids)).toBeFalsy()
  })

  it.each(mainnetFarms.flat())('All tokens should be sorted', (farm) => {
    expect(farm.token.sortsBefore(farm.quoteToken), `${farm.pid}: ${farm.lpAddress}`).toBeTruthy()
  })

  it.each(mainnetFarms.flat())('All tokens same chainId', (farm) => {
    expect(farm.token.chainId === farm.quoteToken.chainId).toBeTruthy()
  })

  it.each(mainnetFarms.flat())('should has correct lpAddress', (farm) => {
    expect(Pool.getAddress(farm.token, farm.quoteToken, farm.feeAmount)).toEqual(farm.lpAddress)
  })

  it.each(mainnetFarms)('should has related common price', (...farms) => {
    for (const farm of farms) {
      const priceHelper = priceHelperTokens[farm.token.chainId].list
      let isOneOfPriceHelper = false
      let isOneOfCake = false

      if (priceHelper.some((t) => t.equals(farm.token) || t.equals(farm.quoteToken))) {
        isOneOfPriceHelper = true
      }
      if (farm.token.equals(CAKE[farm.token.chainId]) || farm.quoteToken.equals(CAKE[farm.quoteToken.chainId])) {
        isOneOfCake = true
      }

      expect(
        isOneOfPriceHelper || isOneOfCake,
        `farm is missing price helper. chainId: ${farm.token.chainId} pid: ${farm.pid}`,
      ).toBeTruthy()
    }
  })
})
