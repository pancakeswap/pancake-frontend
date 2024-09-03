import { expect, test } from 'vitest'
import * as namedExports from './index'

test('exports', () => {
  expect(Object.keys(namedExports)).toMatchInlineSnapshot(`
    [
      "getFarmApr",
      "getPositionFarmApr",
      "getPositionFarmAprFactor",
      "FARM_AUCTION_HOSTING_IN_SECONDS",
      "UNIVERSAL_FARMS",
      "UNIVERSAL_FARMS_MAP",
      "UNIVERSAL_FARMS_WITH_TESTNET",
      "getLegacyFarmConfig",
      "isStableFarm",
      "Protocol",
      "isActiveV3Farm",
      "formatUniversalFarmToSerializedFarm",
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
