import { ChainId } from '@pancakeswap/sdk'
import { Pool } from '@pancakeswap/v3-sdk'
import { describe, it, expect } from 'vitest'
import { farmsV3ConfigChainMap } from '../constants/v3'
import { priceHelperTokens } from '../constants/common'
import { CommonPrice, getFarmsPrices } from '../src/fetchFarmsV3'

const mainnetFarms = [
  farmsV3ConfigChainMap[ChainId.BSC],
  farmsV3ConfigChainMap[ChainId.ETHEREUM],
  farmsV3ConfigChainMap[ChainId.POLYGON_ZKEVM],
  farmsV3ConfigChainMap[ChainId.ZKSYNC],
]

function hasDuplicates(array: any[]) {
  return new Set(array).size !== array.length
}

describe('Config farms V3', () => {
  it.each(mainnetFarms)('All farm has an unique pid', (...farms) => {
    const pids = farms.map((farm) => farm.pid)
    expect(hasDuplicates(pids)).toBeFalsy()
  })

  it.each(mainnetFarms.flat())('All tokens same chainId', (farm) => {
    expect(farm.token.chainId === farm.quoteToken.chainId).toBeTruthy()
  })

  it.each(mainnetFarms.flat())('should has correct lpAddress', (farm) => {
    expect(Pool.getAddress(farm.token, farm.quoteToken, farm.feeAmount)).toEqual(farm.lpAddress)
  })

  it.each(mainnetFarms.flat())('should be sorted', (farm) => {
    expect(farm.token0.sortsBefore(farm.token1)).toBeTruthy()
  })

  it.each(mainnetFarms)('should has related common price', (...farms) => {
    const commonPrice: CommonPrice = {}
    for (const commonToken of priceHelperTokens[farms[0].token.chainId as keyof typeof priceHelperTokens].list) {
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
      expect(farmPrice.tokenPriceBusd, `${farmPrice.token.chainId} ${farmPrice.token.address} price`).not.toEqual('0')
      expect(
        farmPrice.quoteTokenPriceBusd,
        `${farmPrice.quoteToken.chainId} ${farmPrice.quoteToken.address} price`,
      ).not.toEqual('0')
    }
  })
})
