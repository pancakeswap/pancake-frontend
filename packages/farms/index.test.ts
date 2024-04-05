import { expect, test } from 'vitest'
import * as namedExports from './index'

test('exports', () => {
  expect(Object.keys(namedExports)).toMatchInlineSnapshot(`
    [
      "getFarmApr",
      "getPositionFarmApr",
      "getPositionFarmAprFactor",
      "FARM_AUCTION_HOSTING_IN_SECONDS",
      "isStableFarm",
      "isActiveV3Farm",
      "deserializeFarm",
      "deserializeFarmUserData",
      "deserializeFarmBCakeUserData",
      "deserializeFarmBCakePublicData",
      "filterFarmsByQuoteToken",
      "filterFarmsByQuery",
      "bCakeSupportedChainId",
      "supportedChainId",
      "supportedChainIdV2",
      "supportedChainIdV3",
      "createFarmFetcher",
      "createFarmFetcherV3",
      "fetchCommonTokenUSDValue",
      "fetchTokenUSDValues",
      "masterChefV3Addresses",
    ]
  `)
})
