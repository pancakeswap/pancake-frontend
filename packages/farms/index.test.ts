import { expect, test } from 'vitest'
import * as exports from './index'

test('exports', () => {
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "getFarmApr",
      "getPositionFarmApr",
      "getPositionFarmAprFactor",
      "isActiveV3Farm",
      "filterFarmsByQuoteToken",
      "isStableFarm",
      "deserializeFarmUserData",
      "deserializeFarm",
      "FARM_AUCTION_HOSTING_IN_SECONDS",
      "filterFarmsByQuery",
      "supportedChainIdV3",
      "bCakeSupportedChainId",
      "supportedChainIdV2",
      "createFarmFetcher",
      "createFarmFetcherV3",
      "masterChefV3Addresses",
      "fetchCommonTokenUSDValue",
      "fetchTokenUSDValues",
    ]
  `)
})
