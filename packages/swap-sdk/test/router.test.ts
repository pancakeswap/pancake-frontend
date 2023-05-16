import invariant from 'tiny-invariant'
import { Percent, Token, CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import { Router } from '../src/router'
import { Pair, Route, Trade, Native } from '../src/entities'
import { ChainId, WNATIVE } from '../src/constants'

function checkDeadline(deadline: string[] | string): void {
  expect(typeof deadline).toBe('string')
  invariant(typeof deadline === 'string')
  // less than 5 seconds on the deadline
  expect(new Date().getTime() / 1000 - parseInt(deadline)).toBeLessThanOrEqual(5)
}

describe('Router', () => {
  const ETHER = Native.onChain(ChainId.BSC)
  const token0 = new Token(ChainId.BSC, '0x0000000000000000000000000000000000000001', 18, 't0')
  const token1 = new Token(ChainId.BSC, '0x0000000000000000000000000000000000000002', 18, 't1')

  const pair01 = new Pair(CurrencyAmount.fromRawAmount(token0, 1000n), CurrencyAmount.fromRawAmount(token1, 1000n))

  const pairWeth0 = new Pair(
    CurrencyAmount.fromRawAmount(WNATIVE[ChainId.BSC], '1000'),
    CurrencyAmount.fromRawAmount(token0, '1000')
  )

  describe('#swapCallParameters', () => {
    describe('exact in', () => {
      it('ether to token1', () => {
        const result = Router.swapCallParameters(
          Trade.exactIn(
            new Route([pairWeth0, pair01], ETHER, token1),
            CurrencyAmount.fromRawAmount(Native.onChain(ChainId.BSC), 100n)
          ),
          { ttl: 50, recipient: '0x0000000000000000000000000000000000000004', allowedSlippage: new Percent('1', '100') }
        )
        expect(result.methodName).toEqual('swapExactETHForTokens')
        expect(result.args.slice(0, -1)).toEqual([
          '0x51',
          [WNATIVE[ChainId.BSC].address, token0.address, token1.address],
          '0x0000000000000000000000000000000000000004',
        ])
        expect(result.value).toEqual('0x64')
        checkDeadline(result.args[result.args.length - 1])
      })

      it('deadline specified', () => {
        const result = Router.swapCallParameters(
          Trade.exactIn(
            new Route([pairWeth0, pair01], ETHER, token1),
            CurrencyAmount.fromRawAmount(Native.onChain(ChainId.BSC), 100n)
          ),
          {
            deadline: 50,
            recipient: '0x0000000000000000000000000000000000000004',
            allowedSlippage: new Percent('1', '100'),
          }
        )
        expect(result.methodName).toEqual('swapExactETHForTokens')
        expect(result.args).toEqual([
          '0x51',
          [WNATIVE[ChainId.BSC].address, token0.address, token1.address],
          '0x0000000000000000000000000000000000000004',
          '0x32',
        ])
        expect(result.value).toEqual('0x64')
      })

      it('token1 to ether', () => {
        const result = Router.swapCallParameters(
          Trade.exactIn(new Route([pair01, pairWeth0], token1, ETHER), CurrencyAmount.fromRawAmount(token1, 100n)),
          { ttl: 50, recipient: '0x0000000000000000000000000000000000000004', allowedSlippage: new Percent('1', '100') }
        )
        expect(result.methodName).toEqual('swapExactTokensForETH')
        expect(result.args.slice(0, -1)).toEqual([
          '0x64',
          '0x51',
          [token1.address, token0.address, WNATIVE[ChainId.BSC].address],
          '0x0000000000000000000000000000000000000004',
        ])
        expect(result.value).toEqual('0x0')
        checkDeadline(result.args[result.args.length - 1])
      })
      it('token0 to token1', () => {
        const result = Router.swapCallParameters(
          Trade.exactIn(new Route([pair01], token0, token1), CurrencyAmount.fromRawAmount(token0, 100n)),
          { ttl: 50, recipient: '0x0000000000000000000000000000000000000004', allowedSlippage: new Percent('1', '100') }
        )
        expect(result.methodName).toEqual('swapExactTokensForTokens')
        expect(result.args.slice(0, -1)).toEqual([
          '0x64',
          '0x59',
          [token0.address, token1.address],
          '0x0000000000000000000000000000000000000004',
        ])
        expect(result.value).toEqual('0x0')
        checkDeadline(result.args[result.args.length - 1])
      })
    })
    describe('exact out', () => {
      it('ether to token1', () => {
        const result = Router.swapCallParameters(
          Trade.exactOut(new Route([pairWeth0, pair01], ETHER, token1), CurrencyAmount.fromRawAmount(token1, 100n)),
          { ttl: 50, recipient: '0x0000000000000000000000000000000000000004', allowedSlippage: new Percent('1', '100') }
        )
        expect(result.methodName).toEqual('swapETHForExactTokens')
        expect(result.args.slice(0, -1)).toEqual([
          '0x64',
          [WNATIVE[ChainId.BSC].address, token0.address, token1.address],
          '0x0000000000000000000000000000000000000004',
        ])
        expect(result.value).toEqual('0x80')
        checkDeadline(result.args[result.args.length - 1])
      })
      it('token1 to ether', () => {
        const result = Router.swapCallParameters(
          Trade.exactOut(
            new Route([pair01, pairWeth0], token1, ETHER),
            CurrencyAmount.fromRawAmount(Native.onChain(ChainId.BSC), 100n)
          ),
          { ttl: 50, recipient: '0x0000000000000000000000000000000000000004', allowedSlippage: new Percent('1', '100') }
        )
        expect(result.methodName).toEqual('swapTokensForExactETH')
        expect(result.args.slice(0, -1)).toEqual([
          '0x64',
          '0x80',
          [token1.address, token0.address, WNATIVE[ChainId.BSC].address],
          '0x0000000000000000000000000000000000000004',
        ])
        expect(result.value).toEqual('0x0')
        checkDeadline(result.args[result.args.length - 1])
      })
      it('token0 to token1', () => {
        const result = Router.swapCallParameters(
          Trade.exactOut(new Route([pair01], token0, token1), CurrencyAmount.fromRawAmount(token1, 100n)),
          { ttl: 50, recipient: '0x0000000000000000000000000000000000000004', allowedSlippage: new Percent('1', '100') }
        )
        expect(result.methodName).toEqual('swapTokensForExactTokens')
        expect(result.args.slice(0, -1)).toEqual([
          '0x64',
          '0x71',
          [token0.address, token1.address],
          '0x0000000000000000000000000000000000000004',
        ])
        expect(result.value).toEqual('0x0')
        checkDeadline(result.args[result.args.length - 1])
      })
    })
    describe('supporting fee on transfer', () => {
      describe('exact in', () => {
        it('ether to token1', () => {
          const result = Router.swapCallParameters(
            Trade.exactIn(
              new Route([pairWeth0, pair01], ETHER, token1),
              CurrencyAmount.fromRawAmount(Native.onChain(ChainId.BSC), 100n)
            ),
            {
              ttl: 50,
              recipient: '0x0000000000000000000000000000000000000004',
              allowedSlippage: new Percent('1', '100'),
              feeOnTransfer: true,
            }
          )
          expect(result.methodName).toEqual('swapExactETHForTokensSupportingFeeOnTransferTokens')
          expect(result.args.slice(0, -1)).toEqual([
            '0x51',
            [WNATIVE[ChainId.BSC].address, token0.address, token1.address],
            '0x0000000000000000000000000000000000000004',
          ])
          expect(result.value).toEqual('0x64')
          checkDeadline(result.args[result.args.length - 1])
        })
        it('token1 to ether', () => {
          const result = Router.swapCallParameters(
            Trade.exactIn(new Route([pair01, pairWeth0], token1, ETHER), CurrencyAmount.fromRawAmount(token1, 100n)),
            {
              ttl: 50,
              recipient: '0x0000000000000000000000000000000000000004',
              allowedSlippage: new Percent('1', '100'),
              feeOnTransfer: true,
            }
          )
          expect(result.methodName).toEqual('swapExactTokensForETHSupportingFeeOnTransferTokens')
          expect(result.args.slice(0, -1)).toEqual([
            '0x64',
            '0x51',
            [token1.address, token0.address, WNATIVE[ChainId.BSC].address],
            '0x0000000000000000000000000000000000000004',
          ])
          expect(result.value).toEqual('0x0')
          checkDeadline(result.args[result.args.length - 1])
        })
        it('token0 to token1', () => {
          const result = Router.swapCallParameters(
            Trade.exactIn(new Route([pair01], token0, token1), CurrencyAmount.fromRawAmount(token0, 100n)),
            {
              ttl: 50,
              recipient: '0x0000000000000000000000000000000000000004',
              allowedSlippage: new Percent('1', '100'),
              feeOnTransfer: true,
            }
          )
          expect(result.methodName).toEqual('swapExactTokensForTokensSupportingFeeOnTransferTokens')
          expect(result.args.slice(0, -1)).toEqual([
            '0x64',
            '0x59',
            [token0.address, token1.address],
            '0x0000000000000000000000000000000000000004',
          ])
          expect(result.value).toEqual('0x0')
          checkDeadline(result.args[result.args.length - 1])
        })
      })
      describe('exact out', () => {
        it('ether to token1', () => {
          expect(() =>
            Router.swapCallParameters(
              Trade.exactOut(new Route([pairWeth0, pair01], ETHER, token1), CurrencyAmount.fromRawAmount(token1, 100n)),
              {
                ttl: 50,
                recipient: '0x0000000000000000000000000000000000000004',
                allowedSlippage: new Percent('1', '100'),
                feeOnTransfer: true,
              }
            )
          ).toThrow('EXACT_OUT_FOT')
        })
        it('token1 to ether', () => {
          expect(() =>
            Router.swapCallParameters(
              Trade.exactOut(
                new Route([pair01, pairWeth0], token1, ETHER),
                CurrencyAmount.fromRawAmount(Native.onChain(ChainId.BSC), 100n)
              ),
              {
                ttl: 50,
                recipient: '0x0000000000000000000000000000000000000004',
                allowedSlippage: new Percent('1', '100'),
                feeOnTransfer: true,
              }
            )
          ).toThrow('EXACT_OUT_FOT')
        })
        it('token0 to token1', () => {
          expect(() =>
            Router.swapCallParameters(
              Trade.exactOut(new Route([pair01], token0, token1), CurrencyAmount.fromRawAmount(token1, 100n)),
              {
                ttl: 50,
                recipient: '0x0000000000000000000000000000000000000004',
                allowedSlippage: new Percent('1', '100'),
                feeOnTransfer: true,
              }
            )
          ).toThrow('EXACT_OUT_FOT')
        })
      })
    })
  })
})
