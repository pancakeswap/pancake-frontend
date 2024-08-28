import { expect, test } from 'vitest'
import * as namedExports from './index'

test('exports', () => {
  expect(Object.keys(namedExports)).toMatchInlineSnapshot(`
    [
      "UNIVERSAL_BCAKEWRAPPER_FARMS",
      "UNIVERSAL_FARMS",
      "UNIVERSAL_FARMS_WITH_TESTNET",
      "getFarmApr",
      "getPositionFarmApr",
      "getPositionFarmAprFactor",
      "FARM_AUCTION_HOSTING_IN_SECONDS",
      "isStableFarm",
      "Protocol",
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
      "supportedChainIdV4",
      "createFarmFetcher",
      "createFarmFetcherV3",
      "fetchCommonTokenUSDValue",
      "fetchTokenUSDValues",
      "masterChefV3Addresses",
    ]
  `)
})
