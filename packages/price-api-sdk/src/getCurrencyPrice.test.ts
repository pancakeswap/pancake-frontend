import { Native } from '@pancakeswap/sdk'
import { describe, expect, it } from 'vitest'

import { getCurrencyKey, zeroAddress } from './getCurrencyPrice'

describe('getCurrencyPrice', () => {
  describe('getCurrencyKey', () => {
    it('should return undefined if no params', () => {
      expect(getCurrencyKey()).toBeUndefined()
    })

    it('should handle native currency', () => {
      expect(getCurrencyKey({ chainId: 56, isNative: true })).toEqual(`56:${zeroAddress}`)
      expect(getCurrencyKey(Native.onChain(1))).toEqual(`1:${zeroAddress}`)
    })

    it('should handle token', () => {
      expect(getCurrencyKey({ chainId: 56, address: '0x123' })).toEqual(`56:0x123`)
      expect(getCurrencyKey({ chainId: 1, address: '0x123' })).toEqual(`1:0x123`)
      expect(getCurrencyKey({ chainId: 1, address: '0x123', isNative: false })).toEqual(`1:0x123`)
    })
  })
})
