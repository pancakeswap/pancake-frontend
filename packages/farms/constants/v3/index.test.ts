import { ChainId } from '@pancakeswap/sdk'
import { Pool } from '@pancakeswap/v3-sdk'
import { priceHelperTokens, DEFAULT_STABLE_COINS } from '../common'
import { farmsV3ConfigChainMap } from '.'

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
    expect(farm.token.sortsBefore(farm.quoteToken)).toBeTruthy()
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
      const stableCoins = DEFAULT_STABLE_COINS[farm.token.chainId]
      let isOneOfPriceHelper = false
      let isOneOfStableCoin = false

      if (priceHelper.some((t) => t.equals(farm.token) || t.equals(farm.quoteToken))) {
        isOneOfPriceHelper = true
      }
      if (stableCoins.some((t) => t.equals(farm.token) || t.equals(farm.quoteToken))) {
        isOneOfStableCoin = true
      }

      expect(isOneOfPriceHelper || isOneOfStableCoin).toBeTruthy()
    }
  })
})
