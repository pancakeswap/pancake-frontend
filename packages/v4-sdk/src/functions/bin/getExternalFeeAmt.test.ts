import { describe, expect, test } from 'vitest'
import { getExternalFeeAmt } from './getExternalFeeAmt'

describe('getExternalFeeAmt', () => {
  let amounts: [bigint, bigint] = [0n, 0n]
  let protocolFees: [bigint, bigint] = [0n, 0n]
  let swapFee = 0n

  test('0% fee', () => {
    amounts = [100n, 100n]
    protocolFees = [0n, 0n]
    swapFee = 0n
    expect(getExternalFeeAmt(amounts, protocolFees, swapFee)).toEqual([0n, 0n])
  })

  test('0.01% fee', () => {
    amounts = [10000n, 10000n]
    protocolFees = [100n, 100n]
    swapFee = 100n
    expect(getExternalFeeAmt(amounts, protocolFees, swapFee)).toEqual([10000n, 10000n])
  })
})
