import { renderHook } from '@testing-library/react-hooks'
import { bscTokens } from 'config/constants/tokens'
import { createReduxWrapper } from 'testUtils'
import { Pair, TokenAmount, CurrencyAmount, Trade } from '@pancakeswap/sdk'
import * as UsePairs from './usePairs'
import * as Trades from './Trades'

const { PairState } = UsePairs

describe('Trade', () => {
  describe('#useAllCommonPairs', () => {
    const mockUsePairs = jest.spyOn(UsePairs, 'usePairs')
    it('should filter only exist Pair', () => {
      mockUsePairs.mockReturnValue([
        [PairState.EXISTS, new Pair(new TokenAmount(bscTokens.wbnb, '1'), new TokenAmount(bscTokens.cake, '1'))],
        [PairState.INVALID, new Pair(new TokenAmount(bscTokens.busd, '1'), new TokenAmount(bscTokens.cake, '1'))],
        [PairState.LOADING, new Pair(new TokenAmount(bscTokens.busd, '1'), new TokenAmount(bscTokens.wbnb, '1'))],
        [PairState.EXISTS, null],
      ])

      const { result } = renderHook(() => {
        const pairs = Trades.useAllCommonPairs(bscTokens.wbnb, bscTokens.cake)
        return {
          pairs,
        }
      })

      expect(result.current.pairs).toStrictEqual([
        new Pair(new TokenAmount(bscTokens.wbnb, '1'), new TokenAmount(bscTokens.cake, '1')),
      ])
    })
    it('should filter out duplicated Pair', () => {
      mockUsePairs.mockReturnValue([
        [PairState.EXISTS, new Pair(new TokenAmount(bscTokens.wbnb, '1'), new TokenAmount(bscTokens.cake, '1'))],
        [PairState.EXISTS, new Pair(new TokenAmount(bscTokens.wbnb, '1'), new TokenAmount(bscTokens.cake, '1'))],
        [PairState.EXISTS, new Pair(new TokenAmount(bscTokens.cake, '1'), new TokenAmount(bscTokens.wbnb, '1'))],
        [PairState.EXISTS, null],
      ])

      const { result } = renderHook(() => {
        const pairs = Trades.useAllCommonPairs(bscTokens.wbnb, bscTokens.cake)
        return {
          pairs,
        }
      })

      expect(result.current.pairs).toStrictEqual([
        new Pair(new TokenAmount(bscTokens.wbnb, '1'), new TokenAmount(bscTokens.cake, '1')),
      ])
    })

    it('should get all pair combinations wbnb, cake', () => {
      mockUsePairs.mockClear()
      renderHook(() => {
        Trades.useAllCommonPairs(bscTokens.wbnb, bscTokens.cake)
      })

      expect(mockUsePairs).toMatchSnapshot()
    })

    it('should get all pair combinations, wbnb, wbnb', () => {
      mockUsePairs.mockClear()
      renderHook(() => {
        Trades.useAllCommonPairs(bscTokens.wbnb, bscTokens.wbnb)
      })

      expect(mockUsePairs).toMatchSnapshot()
    })
  })

  describe('#useTradeExactIn/Out', () => {
    const mockUseAllCommonPairs = jest.spyOn(Trades, 'useAllCommonPairs')
    const mockTradeExactIn = jest.spyOn(Trade, 'bestTradeExactIn')
    const mockTradeExactOut = jest.spyOn(Trade, 'bestTradeExactOut')

    it('should call with maxHops 1 with singleHopOnly', () => {
      const allowPairs = [new Pair(new TokenAmount(bscTokens.wbnb, '1'), new TokenAmount(bscTokens.cake, '1'))]
      const argA = CurrencyAmount.ether('1000000')
      const argB = bscTokens.cake
      renderHook(
        () => {
          mockUseAllCommonPairs.mockReturnValue(allowPairs)
          Trades.useTradeExactIn(argA, argB)
        },
        {
          wrapper: createReduxWrapper({ user: { userSingleHopOnly: true } }),
        },
      )

      expect(mockTradeExactIn).toBeCalledWith(allowPairs, argA, argB, { maxHops: 1, maxNumResults: 1 })
      mockTradeExactIn.mockClear()

      renderHook(
        () => {
          mockUseAllCommonPairs.mockReturnValue(allowPairs)
          Trades.useTradeExactOut(argB, argA)
        },
        {
          wrapper: createReduxWrapper({ user: { userSingleHopOnly: true } }),
        },
      )

      expect(mockTradeExactOut).toBeCalledWith(allowPairs, argB, argA, { maxHops: 1, maxNumResults: 1 })
      mockTradeExactOut.mockClear()
    })

    it('should call with 3 times without singleHopOnly', () => {
      const allowPairs = [new Pair(new TokenAmount(bscTokens.wbnb, '1'), new TokenAmount(bscTokens.cake, '1'))]
      const argA = CurrencyAmount.ether('1000000')
      const argB = bscTokens.cake
      renderHook(
        () => {
          mockUseAllCommonPairs.mockReturnValue(allowPairs)
          Trades.useTradeExactIn(argA, argB)
        },
        {
          wrapper: createReduxWrapper({ user: { userSingleHopOnly: false } }),
        },
      )

      renderHook(
        () => {
          mockUseAllCommonPairs.mockReturnValue(allowPairs)
          Trades.useTradeExactOut(argB, argA)
        },
        {
          wrapper: createReduxWrapper({ user: { userSingleHopOnly: false } }),
        },
      )

      expect(mockTradeExactOut).toBeCalledTimes(3)
      mockTradeExactOut.mockClear()
    })
  })
})
