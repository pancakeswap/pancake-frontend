import { expect, test } from 'vitest'
import * as namedExports from './index'

test('exports', () => {
  expect(Object.keys(namedExports)).toMatchInlineSnapshot(`
    [
      "getFarmApr",
      "getPositionFarmApr",
      "getPositionFarmAprFactor",
      "FARM_AUCTION_HOSTING_IN_SECONDS",
      "defineFarmV3Configs",
      "defineFarmV3ConfigsFromUniversalFarm",
      "fetchAllUniversalFarms",
      "fetchAllUniversalFarmsMap",
      "UNIVERSAL_FARMS_WITH_TESTNET",
      "fetchUniversalFarms",
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
