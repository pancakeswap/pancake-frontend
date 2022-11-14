import { ChainId, CurrencyAmount, Pair, Route, Token, Trade, TradeType } from '@pancakeswap/sdk'
import { AddressZero } from '@ethersproject/constants'
import { parseUnits } from '@ethersproject/units'
import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { bscTokens } from '@pancakeswap/tokens'

import { StableSwapPair } from '../types'
import { createStableSwapPair } from '../stableSwap'
import * as getAllCommanPairsModule from '../getAllCommonPairs'
import { getBestTradeFromV2ExactIn } from '../getBestTradeFromV2'

type TokenWithAmount = [Token, number]

function getAmount([token, amount]: TokenWithAmount) {
  return CurrencyAmount.fromRawAmount(token, parseUnits(String(amount), token.decimals).toString())
}

function createMockPair(one: TokenWithAmount, another: TokenWithAmount) {
  return new Pair(getAmount(one), getAmount(another))
}

function createMockStableSwapPair(one: TokenWithAmount, another: TokenWithAmount): StableSwapPair {
  const pair = createMockPair(one, another)
  return createStableSwapPair(pair, AddressZero)
}

function createMockTrade(tokens: TokenWithAmount[]) {
  const getPairs = () => {
    const pairs: Pair[] = []
    for (const [index, token] of tokens.entries()) {
      if (index === tokens.length - 1) {
        break
      }
      pairs.push(createMockPair(token, tokens[index + 1]))
    }

    return pairs
  }
  const firstToken = tokens[0]
  const lastToken = tokens[tokens.length - 1]
  const [tokenIn] = firstToken
  const [tokenOut] = tokens[tokens.length - 1]
  const trade = new Trade(new Route(getPairs(), tokenIn, tokenOut), getAmount(firstToken), TradeType.EXACT_INPUT)
  // Override the output amount since trade would calculate the output based on the input
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  ;(trade as any).outputAmount = getAmount(lastToken)
  return trade
}

afterEach(() => {
  jest.restoreAllMocks()
})

describe('getTradeWithStableSwap', () => {
  const provider = new StaticJsonRpcProvider()

  it('No available common pairs', async () => {
    const getAllCommonPairs = jest
      .spyOn(getAllCommanPairsModule, 'getAllCommonPairs')
      .mockImplementationOnce(async () => [])

    await expect(
      getBestTradeFromV2ExactIn(getAmount([bscTokens.busd, 1]), bscTokens.bnb, { provider: () => provider }),
    ).resolves.toBeNull()
    expect(getAllCommonPairs).toHaveBeenCalledTimes(1)
  })

  it('No available trades', async () => {
    const getAllCommonPairs = jest
      .spyOn(getAllCommanPairsModule, 'getAllCommonPairs')
      .mockImplementationOnce(async () => [createMockPair([bscTokens.busd, 300], [bscTokens.bnb, 1])])
    const bestTradeExactIn = jest.spyOn(Trade, 'bestTradeExactIn').mockImplementationOnce(() => [])

    await expect(
      getBestTradeFromV2ExactIn(getAmount([bscTokens.busd, 1]), bscTokens.bnb, {
        provider: () => provider,
        maxHops: 1,
      }),
    ).resolves.toBeNull()
    expect(getAllCommonPairs).toHaveBeenCalledTimes(1)
    expect(bestTradeExactIn).toHaveBeenCalledTimes(1)
  })
})
