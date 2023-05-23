import { describe, it, expect } from 'vitest'
import { Price, Token } from '@pancakeswap/swap-sdk-core'
import { tickToPrice } from './index'
import { priceToClosestTick } from './priceTickConversions'

describe('priceTickConversions', () => {
  /**
   * Creates an example token with a specific sort order
   */
  function token({
    sortOrder,
    decimals = 18,
    chainId = 1,
  }: {
    sortOrder: number
    decimals?: number
    chainId?: number
  }): Token {
    if (sortOrder > 9 || sortOrder % 1 !== 0) throw new Error('invalid sort order')
    return new Token(
      chainId,
      `0x${new Array<string>(40).fill(`${sortOrder}`).join('')}`,
      decimals,
      `T${sortOrder}`,
      `token${sortOrder}`
    )
  }

  const token0 = token({ sortOrder: 0 })
  const token1 = token({ sortOrder: 1 })
  const token2_6decimals = token({ sortOrder: 2, decimals: 6 })

  describe('#tickToPrice', () => {
    it('1800 t0/1 t1', () => {
      expect(tickToPrice(token1, token0, -74959).toSignificant(5)).toEqual('1800')
    })

    it('1 t1/1800 t0', () => {
      expect(tickToPrice(token0, token1, -74959).toSignificant(5)).toEqual('0.00055556')
    })

    it('1800 t1/1 t0', () => {
      expect(tickToPrice(token0, token1, 74959).toSignificant(5)).toEqual('1800')
    })

    it('1 t0/1800 t1', () => {
      expect(tickToPrice(token1, token0, 74959).toSignificant(5)).toEqual('0.00055556')
    })

    describe('12 decimal difference', () => {
      it('1.01 t2/1 t0', () => {
        expect(tickToPrice(token0, token2_6decimals, -276225).toSignificant(5)).toEqual('1.01')
      })

      it('1 t0/1.01 t2', () => {
        expect(tickToPrice(token2_6decimals, token0, -276225).toSignificant(5)).toEqual('0.99015')
      })

      it('1 t2/1.01 t0', () => {
        expect(tickToPrice(token0, token2_6decimals, -276423).toSignificant(5)).toEqual('0.99015')
      })

      it('1.01 t0/1 t2', () => {
        expect(tickToPrice(token2_6decimals, token0, -276423).toSignificant(5)).toEqual('1.0099')
      })

      it('1.01 t2/1 t0', () => {
        expect(tickToPrice(token0, token2_6decimals, -276225).toSignificant(5)).toEqual('1.01')
      })

      it('1 t0/1.01 t2', () => {
        expect(tickToPrice(token2_6decimals, token0, -276225).toSignificant(5)).toEqual('0.99015')
      })
    })
  })

  describe('#priceToClosestTick', () => {
    it('1800 t0/1 t1', () => {
      expect(priceToClosestTick(new Price(token1, token0, 1, 1800))).toEqual(-74960)
    })

    it('1 t1/1800 t0', () => {
      expect(priceToClosestTick(new Price(token0, token1, 1800, 1))).toEqual(-74960)
    })

    it('1.01 t2/1 t0', () => {
      expect(priceToClosestTick(new Price(token0, token2_6decimals, 100e18, 101e6))).toEqual(-276225)
    })

    it('1 t0/1.01 t2', () => {
      expect(priceToClosestTick(new Price(token2_6decimals, token0, 101e6, 100e18))).toEqual(-276225)
    })

    describe('reciprocal with tickToPrice', () => {
      it('1800 t0/1 t1', () => {
        expect(priceToClosestTick(tickToPrice(token1, token0, -74960))).toEqual(-74960)
      })

      it('1 t0/1800 t1', () => {
        expect(priceToClosestTick(tickToPrice(token1, token0, 74960))).toEqual(74960)
      })

      it('1 t1/1800 t0', () => {
        expect(priceToClosestTick(tickToPrice(token0, token1, -74960))).toEqual(-74960)
      })

      it('1800 t1/1 t0', () => {
        expect(priceToClosestTick(tickToPrice(token0, token1, 74960))).toEqual(74960)
      })

      it('1.01 t2/1 t0', () => {
        expect(priceToClosestTick(tickToPrice(token0, token2_6decimals, -276225))).toEqual(-276225)
      })

      it('1 t0/1.01 t2', () => {
        expect(priceToClosestTick(tickToPrice(token2_6decimals, token0, -276225))).toEqual(-276225)
      })
    })
  })
})
