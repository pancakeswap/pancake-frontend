import { zeroAddress } from 'viem'
import { expect, test } from 'vitest'
import { PoolKey, toId } from './poolKey'

test('BinPoolKey toId', () => {
  const binPoolKey: PoolKey<'Bin'> = {
    currency0: zeroAddress,
    currency1: zeroAddress,
    poolManger: zeroAddress,
    fee: 3000,
    parameters: {
      binStep: 10,
    },
  }
  expect(toId(binPoolKey)).toBe('0xed39e13743a8db9e0fab025534f857fc13f5af4aace6d3deb9907b0bb9af7063')
})

test('CLPoolKey toId', () => {
  const clPoolKey: PoolKey<'CL'> = {
    currency0: zeroAddress,
    currency1: zeroAddress,
    poolManger: zeroAddress,
    fee: 3000,
    parameters: {
      tickSpacing: 10,
      hooksRegistration: {
        beforeSwap: true,
      },
    },
  }
  expect(toId(clPoolKey)).toBe('0x0f2e9d5df51e26258038163179bbedcf8f4318a4a456e61934f3aab1a504db58')
})
