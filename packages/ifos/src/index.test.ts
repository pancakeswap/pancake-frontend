import { expect, test } from 'vitest'
import * as exportedNames from './index'

test('exports', () => {
  expect(Object.keys(exportedNames)).toMatchInlineSnapshot(`
    [
      "PoolIds",
      "MessageStatus",
      "CAKE_BNB_LP_MAINNET",
      "cakeBnbLpToken",
      "CROSS_CHAIN_ONLY_SUPPORTED_CHAIN_IDS",
      "PROFILE_SUPPORTED_CHAIN_IDS",
      "SUPPORTED_CHAIN_IDS",
      "SOURCE_CHAIN_MAP",
      "SOURCE_CHAIN_TO_DEST_CHAINS",
      "CROSS_CHAIN_GAS_MULTIPLIER",
      "ICAKE",
      "INFO_SENDER",
      "isIfoSupported",
      "isNativeIfoSupported",
      "isCrossChainIfoSupportedOnly",
      "getContractAddress",
      "getCrossChainMessageUrl",
      "getLayerZeroChainId",
      "getChainIdByLZChainId",
      "getInfoSenderContract",
      "getSourceChain",
      "getDestChains",
      "getIfoConfig",
      "getActiveIfo",
      "getInActiveIfos",
      "getTotalIFOSold",
      "getIfoCreditAddressContract",
      "fetchPublicIfoData",
      "fetchUserIfoCredit",
      "getUserIfoInfo",
      "getCurrentIfoRatio",
      "fetchUserVestingData",
      "fetchUserVestingDataV8",
      "getBridgeICakeGasFee",
      "getCrossChainMessage",
      "iCakeABI",
      "pancakeInfoSenderABI",
      "ifoV7ABI",
      "ifoV8ABI",
    ]
  `)
})
