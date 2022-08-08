import invariant from 'tiny-invariant'
import JSBI from 'jsbi'
import { ChainId, WNATIVE as _WETH, TradeType, Rounding, Token, TokenAmount, Pair, Route, Trade } from '../src'

const ADDRESSES = [
  '0x0000000000000000000000000000000000000001',
  '0x0000000000000000000000000000000000000002',
  '0x0000000000000000000000000000000000000003',
]
const CHAIN_ID = ChainId.BSC_TESTNET
const WETH = _WETH[ChainId.BSC_TESTNET]
const DECIMAL_PERMUTATIONS: [number, number, number][] = [
  [0, 0, 0],
  [0, 9, 18],
  [18, 18, 18],
]

function decimalize(amount: number, decimals: number): JSBI {
  return JSBI.multiply(JSBI.BigInt(amount), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals)))
}

describe('entities', () => {
  DECIMAL_PERMUTATIONS.forEach((decimals) => {
    describe(`decimals permutation: ${decimals}`, () => {
      let tokens: Token[]
      it('Token', () => {
        tokens = ADDRESSES.map((address, i) => new Token(CHAIN_ID, address, decimals[i]))
        tokens.forEach((token, i) => {
          expect(token.chainId).toEqual(CHAIN_ID)
          expect(token.address).toEqual(ADDRESSES[i])
          expect(token.decimals).toEqual(decimals[i])
        })
      })

      let pairs: Pair[]
      it('Pair', () => {
        pairs = [
          new Pair(
            new TokenAmount(tokens[0], decimalize(1, tokens[0].decimals)),
            new TokenAmount(tokens[1], decimalize(1, tokens[1].decimals))
          ),
          new Pair(
            new TokenAmount(tokens[1], decimalize(1, tokens[1].decimals)),
            new TokenAmount(tokens[2], decimalize(1, tokens[2].decimals))
          ),
          new Pair(
            new TokenAmount(tokens[2], decimalize(1, tokens[2].decimals)),
            new TokenAmount(WETH, decimalize(1234, WETH.decimals))
          ),
        ]
      })

      let route: Route
      it('Route', () => {
        route = new Route(pairs, tokens[0])
        expect(route.pairs).toEqual(pairs)
        expect(route.path).toEqual(tokens.concat([WETH]))
        expect(route.input).toEqual(tokens[0])
        expect(route.output).toEqual(WETH)
      })

      it('Price:Route.midPrice', () => {
        invariant(route.input instanceof Token)
        invariant(route.output instanceof Token)
        expect(route.midPrice.quote(new TokenAmount(route.input, decimalize(1, route.input.decimals)))).toEqual(
          new TokenAmount(route.output, decimalize(1234, route.output.decimals))
        )
        expect(
          route.midPrice.invert().quote(new TokenAmount(route.output, decimalize(1234, route.output.decimals)))
        ).toEqual(new TokenAmount(route.input, decimalize(1, route.input.decimals)))

        expect(route.midPrice.toSignificant(1)).toEqual('1000')
        expect(route.midPrice.toSignificant(2)).toEqual('1200')
        expect(route.midPrice.toSignificant(3)).toEqual('1230')
        expect(route.midPrice.toSignificant(4)).toEqual('1234')
        expect(route.midPrice.toSignificant(5)).toEqual('1234')
        expect(route.midPrice.toSignificant(5, { groupSeparator: ',' })).toEqual('1,234')
        expect(route.midPrice.invert().toSignificant(1)).toEqual('0.0008')
        expect(route.midPrice.invert().toSignificant(2)).toEqual('0.00081')
        expect(route.midPrice.invert().toSignificant(3)).toEqual('0.00081')
        expect(route.midPrice.invert().toSignificant(4)).toEqual('0.0008104')
        expect(route.midPrice.invert().toSignificant(4, undefined, Rounding.ROUND_DOWN)).toEqual('0.0008103')
        expect(route.midPrice.invert().toSignificant(5)).toEqual('0.00081037')

        expect(route.midPrice.toFixed(0)).toEqual('1234')
        expect(route.midPrice.toFixed(1)).toEqual('1234.0')
        expect(route.midPrice.toFixed(2)).toEqual('1234.00')
        expect(route.midPrice.toFixed(2, { groupSeparator: ',' })).toEqual('1,234.00')
        expect(route.midPrice.invert().toFixed(0)).toEqual('0')
        expect(route.midPrice.invert().toFixed(1)).toEqual('0.0')
        expect(route.midPrice.invert().toFixed(2)).toEqual('0.00')
        expect(route.midPrice.invert().toFixed(3)).toEqual('0.001')
        expect(route.midPrice.invert().toFixed(4)).toEqual('0.0008')
        expect(route.midPrice.invert().toFixed(5)).toEqual('0.00081')
        expect(route.midPrice.invert().toFixed(6)).toEqual('0.000810')
        expect(route.midPrice.invert().toFixed(7)).toEqual('0.0008104')
        expect(route.midPrice.invert().toFixed(7, undefined, Rounding.ROUND_DOWN)).toEqual('0.0008103')
        expect(route.midPrice.invert().toFixed(8)).toEqual('0.00081037')
      })

      describe('Trade', () => {
        let route: Route
        it('TradeType.EXACT_INPUT', () => {
          route = new Route(
            [
              new Pair(
                new TokenAmount(tokens[1], decimalize(5, tokens[1].decimals)),
                new TokenAmount(WETH, decimalize(10, WETH.decimals))
              ),
            ],
            tokens[1]
          )
          const inputAmount = new TokenAmount(tokens[1], decimalize(1, tokens[1].decimals))
          const expectedOutputAmount = new TokenAmount(WETH, '1663192997082117548')
          const trade = new Trade(route, inputAmount, TradeType.EXACT_INPUT)
          expect(trade.route).toEqual(route)
          expect(trade.tradeType).toEqual(TradeType.EXACT_INPUT)
          expect(trade.inputAmount).toEqual(inputAmount)
          expect(trade.outputAmount).toEqual(expectedOutputAmount)

          expect(trade.executionPrice.toSignificant(18)).toEqual('1.66319299708211755')
          expect(trade.executionPrice.invert().toSignificant(18)).toEqual('0.601253132832080201')
          expect(trade.executionPrice.quote(inputAmount)).toEqual(expectedOutputAmount)
          expect(trade.executionPrice.invert().quote(expectedOutputAmount)).toEqual(inputAmount)

          expect(trade.nextMidPrice.toSignificant(18)).toEqual('1.38946783381964708')
          expect(trade.nextMidPrice.invert().toSignificant(18)).toEqual('0.7197')

          expect(trade.priceImpact.toSignificant(18)).toEqual('16.8403501458941226')
        })

        it('TradeType.EXACT_OUTPUT', () => {
          const outputAmount = new TokenAmount(WETH, '1663192997082117548')
          const expectedInputAmount = new TokenAmount(tokens[1], decimalize(1, tokens[1].decimals))
          const trade = new Trade(route, outputAmount, TradeType.EXACT_OUTPUT)
          expect(trade.route).toEqual(route)
          expect(trade.tradeType).toEqual(TradeType.EXACT_OUTPUT)
          expect(trade.outputAmount).toEqual(outputAmount)
          expect(trade.inputAmount).toEqual(expectedInputAmount)

          expect(trade.executionPrice.toSignificant(18)).toEqual('1.66319299708211755')
          expect(trade.executionPrice.invert().toSignificant(18)).toEqual('0.601253132832080201')
          expect(trade.executionPrice.quote(expectedInputAmount)).toEqual(outputAmount)
          expect(trade.executionPrice.invert().quote(outputAmount)).toEqual(expectedInputAmount)

          expect(trade.nextMidPrice.toSignificant(18)).toEqual('1.38946783381964708')
          expect(trade.nextMidPrice.invert().toSignificant(18)).toEqual('0.7197')

          expect(trade.priceImpact.toSignificant(18)).toEqual('16.8403501458941226')
        })

        it('minimum TradeType.EXACT_INPUT', () => {
          if ([9, 18].includes(tokens[1].decimals)) {
            const route = new Route(
              [
                new Pair(
                  new TokenAmount(tokens[1], decimalize(1, tokens[1].decimals)),
                  new TokenAmount(
                    WETH,
                    JSBI.add(
                      decimalize(10, WETH.decimals),

                      tokens[1].decimals === 9 ? JSBI.BigInt('30090280812437312') : JSBI.BigInt('30090270812437322')
                    )
                  )
                ),
              ],
              tokens[1],
              WETH
            )
            const outputAmount = new TokenAmount(tokens[1], '1')
            const trade = new Trade(route, outputAmount, TradeType.EXACT_INPUT)

            expect(trade.priceImpact.toSignificant(18)).toEqual(
              tokens[1].decimals === 9 ? '0.2500001008007499' : '0.3000000000000001'
            )
          }
        })
      })

      it('TokenAmount', () => {
        const amount = new TokenAmount(WETH, '1234567000000000000000')
        expect(amount.toExact()).toEqual('1234.567')
        expect(amount.toExact({ groupSeparator: ',' })).toEqual('1,234.567')
      })
    })
  })
})
