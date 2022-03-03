/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import { renderHook } from '@testing-library/react-hooks'
import { testnetTokens } from 'config/constants/tokens'
import { parse } from 'querystring'
import { createWrapper } from 'testUtils'
import { Field } from './actions'
import { DEFAULT_OUTPUT_CURRENCY } from './constants'
import { queryParametersToSwapState, tryParseAmount, useDerivedSwapInfo } from './hooks'

describe('hooks', () => {
  describe('#queryParametersToSwapState', () => {
    test('BNB to DAI', () => {
      expect(
        queryParametersToSwapState(
          parse(
            'inputCurrency=BNB&outputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&exactAmount=20.5&exactField=outPUT',
          ),
        ),
      ).toEqual({
        [Field.OUTPUT]: { currencyId: '0x6B175474E89094C44Da98b954EedeAC495271d0F' },
        [Field.INPUT]: { currencyId: 'BNB' },
        typedValue: '20.5',
        independentField: Field.OUTPUT,
        pairDataById: {},
        derivedPairDataById: {},
        recipient: null,
      })
    })

    test('should return BNB BUSD pair by default', () => {
      expect(queryParametersToSwapState(parse(''))).toEqual({
        [Field.OUTPUT]: { currencyId: DEFAULT_OUTPUT_CURRENCY },
        [Field.INPUT]: { currencyId: 'BNB' },
        typedValue: '',
        independentField: Field.INPUT,
        pairDataById: {},
        derivedPairDataById: {},
        recipient: null,
      })
    })

    test('does not duplicate BNB for invalid output token', () => {
      expect(queryParametersToSwapState(parse('outputCurrency=invalid'))).toEqual({
        [Field.INPUT]: { currencyId: '' },
        [Field.OUTPUT]: { currencyId: 'BNB' },
        typedValue: '',
        independentField: Field.INPUT,
        pairDataById: {},
        derivedPairDataById: {},
        recipient: null,
      })
    })

    test('output BNB only', () => {
      expect(queryParametersToSwapState(parse('outputCurrency=bnb&exactAmount=20.5'))).toEqual({
        [Field.OUTPUT]: { currencyId: 'BNB' },
        [Field.INPUT]: { currencyId: '' },
        typedValue: '20.5',
        independentField: Field.INPUT,
        pairDataById: {},
        derivedPairDataById: {},
        recipient: null,
      })
    })

    test('invalid recipient', () => {
      expect(queryParametersToSwapState(parse('outputCurrency=BNB&exactAmount=20.5&recipient=abc'))).toEqual({
        [Field.OUTPUT]: { currencyId: 'BNB' },
        [Field.INPUT]: { currencyId: '' },
        typedValue: '20.5',
        independentField: Field.INPUT,
        pairDataById: {},
        derivedPairDataById: {},
        recipient: null,
      })
    })

    test('valid recipient', () => {
      expect(
        queryParametersToSwapState(
          parse('outputCurrency=BNB&exactAmount=20.5&recipient=0x0fF2D1eFd7A57B7562b2bf27F3f37899dB27F4a5'),
        ),
      ).toEqual({
        [Field.OUTPUT]: { currencyId: 'BNB' },
        [Field.INPUT]: { currencyId: '' },
        typedValue: '20.5',
        independentField: Field.INPUT,
        pairDataById: {},
        derivedPairDataById: {},
        recipient: '0x0fF2D1eFd7A57B7562b2bf27F3f37899dB27F4a5',
      })
    })
    test('accepts any recipient', () => {
      expect(queryParametersToSwapState(parse('outputCurrency=BNB&exactAmount=20.5&recipient=bob.argent.xyz'))).toEqual(
        {
          [Field.OUTPUT]: { currencyId: 'BNB' },
          [Field.INPUT]: { currencyId: '' },
          typedValue: '20.5',
          independentField: Field.INPUT,
          pairDataById: {},
          derivedPairDataById: {},
          recipient: 'bob.argent.xyz',
        },
      )
    })
  })

  describe('#tryParseAmount', () => {
    it('should be undefined when no valid input', () => {
      expect(tryParseAmount()).toBeUndefined()
    })
    it('should be undefined when input is 0', () => {
      expect(tryParseAmount('0.00')).toBeUndefined()
    })

    it('should pared value', () => {
      expect(tryParseAmount('100', testnetTokens.cake)).toBeTruthy()
    })
  })
})

// weird bug on jest Reference Error, must use `var` here
var mockUseActiveWeb3React: jest.Mock

jest.mock('../../hooks/useActiveWeb3React', () => {
  mockUseActiveWeb3React = jest.fn().mockReturnValue({})
  return {
    __esModule: true,
    default: mockUseActiveWeb3React,
  }
})

describe('#useDerivedSwapInfo', () => {
  it('should show Login Error', async () => {
    const { result, rerender } = renderHook(
      () => {
        return useDerivedSwapInfo()
      },
      { wrapper: createWrapper() },
    )
    expect(result.current.inputError).toBe('Connect Wallet')

    mockUseActiveWeb3React.mockReturnValue({ account: '0x33edFBc4934baACc78f4d317bc07639119dd3e78' })
    rerender()

    expect(result.current.inputError).toBe('Enter an amount')
    mockUseActiveWeb3React.mockClear()
  })

  it('should show [Enter a recipient] Error', async () => {
    mockUseActiveWeb3React.mockReturnValue({ account: '0x33edFBc4934baACc78f4d317bc07639119dd3e78' })
    const { result, rerender } = renderHook(
      () => {
        return useDerivedSwapInfo()
      },
      {
        wrapper: createWrapper({
          swap: {
            typedValue: '0.11',
            [Field.INPUT]: { currencyId: 'BNB' },
            [Field.OUTPUT]: { currencyId: 'BNB' },
          },
        }),
      },
    )

    rerender()

    expect(result.current.inputError).toBe('Enter a recipient')
    mockUseActiveWeb3React.mockClear()
  })

  it('should return undefined when no pair', async () => {
    const { result } = renderHook(
      () => {
        const swapInfo = useDerivedSwapInfo()
        return {
          swapInfo,
        }
      },
      {
        wrapper: createWrapper(),
      },
    )

    expect(result.current.swapInfo.currencies.INPUT).toBeUndefined()
    expect(result.current.swapInfo.currencies.OUTPUT).toBeUndefined()
    expect(result.current.swapInfo.currencyBalances.INPUT).toBeUndefined()
    expect(result.current.swapInfo.currencyBalances.OUTPUT).toBeUndefined()
    expect(result.current.swapInfo.v2Trade).toBeUndefined()
    expect(result.current.swapInfo.parsedAmount).toBeUndefined()
  })
})
