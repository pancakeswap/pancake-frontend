import { MaxUint256 } from '@uniswap/sdk-core'
import JSBI from 'jsbi'
import { encodeSqrtRatioX96 } from './encodeSqrtRatioX96'
import { maxLiquidityForAmounts } from './maxLiquidityForAmounts'

describe('#maxLiquidityForAmounts', () => {
  describe('imprecise', () => {
    describe('price inside', () => {
      it('100 token0, 200 token1', () => {
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(1, 1),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            '100',
            '200',
            false
          )
        ).toEqual(JSBI.BigInt(2148))
      })

      it('100 token0, max token1', () => {
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(1, 1),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            '100',
            MaxUint256,
            false
          )
        ).toEqual(JSBI.BigInt(2148))
      })

      it('max token0, 200 token1', () => {
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(1, 1),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            MaxUint256,
            '200',
            false
          )
        ).toEqual(JSBI.BigInt(4297))
      })
    })

    describe('price below', () => {
      it('100 token0, 200 token1', () => {
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(99, 110),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            '100',
            '200',
            false
          )
        ).toEqual(JSBI.BigInt(1048))
      })

      it('100 token0, max token1', () => {
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(99, 110),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            '100',
            MaxUint256,
            false
          )
        ).toEqual(JSBI.BigInt(1048))
      })

      it('max token0, 200 token1', () => {
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(99, 110),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            MaxUint256,
            '200',
            false
          )
        ).toEqual(JSBI.BigInt('1214437677402050006470401421068302637228917309992228326090730924516431320489727'))
      })
    })

    describe('price above', () => {
      it('100 token0, 200 token1', () => {
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(111, 100),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            '100',
            '200',
            false
          )
        ).toEqual(JSBI.BigInt(2097))
      })

      it('100 token0, max token1', () => {
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(111, 100),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            '100',
            MaxUint256,
            false
          )
        ).toEqual(JSBI.BigInt('1214437677402050006470401421098959354205873606971497132040612572422243086574654'))
      })

      it('max token0, 200 token1', () => {
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(111, 100),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            MaxUint256,
            '200',
            false
          )
        ).toEqual(JSBI.BigInt(2097))
      })
    })
  })

  describe('precise', () => {
    describe('price inside', () => {
      it('100 token0, 200 token1', () => {
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(1, 1),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            '100',
            '200',
            true
          )
        ).toEqual(JSBI.BigInt(2148))
      })

      it('100 token0, max token1', () => {
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(1, 1),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            '100',
            MaxUint256,
            true
          )
        ).toEqual(JSBI.BigInt(2148))
      })

      it('max token0, 200 token1', () => {
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(1, 1),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            MaxUint256,
            '200',
            true
          )
        ).toEqual(JSBI.BigInt(4297))
      })
    })

    describe('price below', () => {
      it('100 token0, 200 token1', () => {
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(99, 110),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            '100',
            '200',
            true
          )
        ).toEqual(JSBI.BigInt(1048))
      })

      it('100 token0, max token1', () => {
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(99, 110),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            '100',
            MaxUint256,
            true
          )
        ).toEqual(JSBI.BigInt(1048))
      })

      it('max token0, 200 token1', () => {
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(99, 110),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            MaxUint256,
            '200',
            true
          )
        ).toEqual(JSBI.BigInt('1214437677402050006470401421082903520362793114274352355276488318240158678126184'))
      })
    })

    describe('price above', () => {
      it('100 token0, 200 token1', () => {
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(111, 100),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            '100',
            '200',
            true
          )
        ).toEqual(JSBI.BigInt(2097))
      })

      it('100 token0, max token1', () => {
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(111, 100),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            '100',
            MaxUint256,
            true
          )
        ).toEqual(JSBI.BigInt('1214437677402050006470401421098959354205873606971497132040612572422243086574654'))
      })

      it('max token0, 200 token1', () => {
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(111, 100),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            MaxUint256,
            '200',
            true
          )
        ).toEqual(JSBI.BigInt(2097))
      })
    })
  })
})
