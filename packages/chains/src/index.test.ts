import { expect, test } from 'vitest'
import * as exports from './index'

test('exports', () => {
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "ChainId",
      "testnetChainIds",
      "chainNames",
      "chainNameToChainId",
      "defiLlamaChainNames",
      "getChainName",
      "getLlamaChainName",
      "getChainIdByChainName",
      "isTestnetChainId",
      "V3_SUBGRAPHS",
      "V2_SUBGRAPHS",
      "BLOCKS_SUBGRAPHS",
      "STABLESWAP_SUBGRAPHS",
      "getV3Subgraphs",
      "getV2Subgraphs",
      "getBlocksSubgraphs",
    ]
  `)
})
