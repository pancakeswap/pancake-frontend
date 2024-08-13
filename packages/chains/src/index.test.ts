import { expect, test } from 'vitest'
import * as exports from './index'

test('exports', () => {
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "AVERAGE_CHAIN_BLOCK_TIMES",
      "ChainId",
      "testnetChainIds",
      "chainNames",
      "chainNamesInKebabCase",
      "mainnetChainNamesInKebabCase",
      "chainNameToChainId",
      "defiLlamaChainNames",
      "getChainName",
      "getChainNameInKebabCase",
      "getMainnetChainNameInKebabCase",
      "getLlamaChainName",
      "getChainIdByChainName",
      "isTestnetChainId",
      "V3_SUBGRAPHS",
      "V2_SUBGRAPHS",
      "BLOCKS_SUBGRAPHS",
      "STABLESWAP_SUBGRAPHS",
      "getStableSwapSubgraphs",
      "getV3Subgraphs",
      "getV2Subgraphs",
      "getBlocksSubgraphs",
    ]
  `)
})
