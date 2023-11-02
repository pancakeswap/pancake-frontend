import { expect, test } from 'vitest'
import * as exportedNames from './index'

test('exports', () => {
  expect(Object.keys(exportedNames)).toMatchInlineSnapshot(`
    [
      "PoolIds",
      "MessageStatus",
      "getIfoConfig",
      "getActiveIfo",
      "getInActiveIfos",
      "CAKE_BNB_LP_MAINNET",
      "cakeBnbLpToken",
      "CROSS_CHAIN_ONLY_SUPPORTED_CHAIN_IDS",
      "PROFILE_SUPPORTED_CHAIN_IDS",
      "SUPPORTED_CHAIN_IDS",
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
      "getIfoCreditAddressContract",
      "fetchPublicIfoData",
      "fetchUserIfoCredit",
      "fetchUserVestingData",
      "getBridgeICakeGasFee",
      "getCrossChainMessage",
      "iCakeABI",
      "pancakeInfoSenderABI",
      "ifoV7ABI",
    ]
  `)
})
