import { expect, test } from 'vitest'
import * as exports from './index'

test('exports', () => {
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "getDefaultGasLimit",
      "getDefaultGasBuffer",
      "getGasLimitOnChain",
      "getGasLimit",
      "iMulticallABI",
      "multicall3ABI",
      "MULTICALL_ADDRESS",
      "MULTICALL3_ADDRESS",
      "MULTICALL3_ADDRESSES",
      "DEFAULT_BLOCK_CONFLICT_TOLERANCE",
      "BLOCK_CONFLICT_TOLERANCE",
      "DEFAULT_GAS_LIMIT",
      "DEFAULT_GAS_LIMIT_BY_CHAIN",
      "DEFAULT_GAS_BUFFER",
      "DEFAULT_GAS_BUFFER_BY_CHAIN",
      "getMulticallContract",
      "getMulticall3ContractAddress",
      "multicallByGasLimit",
      "getBlockConflictTolerance",
    ]
  `)
})
