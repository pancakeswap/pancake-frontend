import { Token, CurrencyAmount, Price } from '@pancakeswap/swap-sdk-core'
import { Pair } from '../src/entities'
import { ChainId, WNATIVE } from '../src/constants'

describe('Pair', () => {
  const USDC = new Token(ChainId.BSC, '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 18, 'USDC', 'USD Coin')
  const DAI = new Token(ChainId.BSC, '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', 18, 'DAI', 'DAI Stablecoin')

  describe('constructor', () => {
    it('cannot be used for tokens on different chains', () => {
      expect(
        () =>
          new Pair(
            CurrencyAmount.fromRawAmount(USDC, '100'),
            CurrencyAmount.fromRawAmount(WNATIVE[ChainId.BSC_TESTNET], '100')
          )
      ).toThrow('CHAIN_IDS')
    })
  })

  describe('#getAddress', () => {
    it('returns the correct address', () => {
      expect(Pair.getAddress(USDC, DAI)).toEqual('0xadBba1EF326A33FDB754f14e62A96D5278b942Bd')
    })
  })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      expect(
        new Pair(CurrencyAmount.fromRawAmount(USDC, '100'), CurrencyAmount.fromRawAmount(DAI, '100')).token0
      ).toEqual(DAI)
      expect(
        new Pair(CurrencyAmount.fromRawAmount(DAI, '100'), CurrencyAmount.fromRawAmount(USDC, '100')).token0
      ).toEqual(DAI)
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      expect(
        new Pair(CurrencyAmount.fromRawAmount(USDC, '100'), CurrencyAmount.fromRawAmount(DAI, '100')).token1
      ).toEqual(USDC)
      expect(
        new Pair(CurrencyAmount.fromRawAmount(DAI, '100'), CurrencyAmount.fromRawAmount(USDC, '100')).token1
      ).toEqual(USDC)
    })
  })
  describe('#reserve0', () => {
    it('always comes from the token that sorts before', () => {
      expect(
        new Pair(CurrencyAmount.fromRawAmount(USDC, '100'), CurrencyAmount.fromRawAmount(DAI, '101')).reserve0
      ).toEqual(CurrencyAmount.fromRawAmount(DAI, '101'))
      expect(
        new Pair(CurrencyAmount.fromRawAmount(DAI, '101'), CurrencyAmount.fromRawAmount(USDC, '100')).reserve0
      ).toEqual(CurrencyAmount.fromRawAmount(DAI, '101'))
    })
  })
  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(
        new Pair(CurrencyAmount.fromRawAmount(USDC, '100'), CurrencyAmount.fromRawAmount(DAI, '101')).reserve1
      ).toEqual(CurrencyAmount.fromRawAmount(USDC, '100'))
      expect(
        new Pair(CurrencyAmount.fromRawAmount(DAI, '101'), CurrencyAmount.fromRawAmount(USDC, '100')).reserve1
      ).toEqual(CurrencyAmount.fromRawAmount(USDC, '100'))
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(
        new Pair(CurrencyAmount.fromRawAmount(USDC, '101'), CurrencyAmount.fromRawAmount(DAI, '100')).token0Price
      ).toEqual(new Price(DAI, USDC, '100', '101'))
      expect(
        new Pair(CurrencyAmount.fromRawAmount(DAI, '100'), CurrencyAmount.fromRawAmount(USDC, '101')).token0Price
      ).toEqual(new Price(DAI, USDC, '100', '101'))
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(
        new Pair(CurrencyAmount.fromRawAmount(USDC, '101'), CurrencyAmount.fromRawAmount(DAI, '100')).token1Price
      ).toEqual(new Price(USDC, DAI, '101', '100'))
      expect(
        new Pair(CurrencyAmount.fromRawAmount(DAI, '100'), CurrencyAmount.fromRawAmount(USDC, '101')).token1Price
      ).toEqual(new Price(USDC, DAI, '101', '100'))
    })
  })

  describe('#priceOf', () => {
    const pair = new Pair(CurrencyAmount.fromRawAmount(USDC, '101'), CurrencyAmount.fromRawAmount(DAI, '100'))
    it('returns price of token in terms of other token', () => {
      expect(pair.priceOf(DAI)).toEqual(pair.token0Price)
      expect(pair.priceOf(USDC)).toEqual(pair.token1Price)
    })

    it('throws if invalid token', () => {
      expect(() => pair.priceOf(WNATIVE[ChainId.BSC])).toThrow('TOKEN')
    })
  })

  describe('#reserveOf', () => {
    it('returns reserves of the given token', () => {
      expect(
        new Pair(CurrencyAmount.fromRawAmount(USDC, '100'), CurrencyAmount.fromRawAmount(DAI, '101')).reserveOf(USDC)
      ).toEqual(CurrencyAmount.fromRawAmount(USDC, '100'))
      expect(
        new Pair(CurrencyAmount.fromRawAmount(DAI, '101'), CurrencyAmount.fromRawAmount(USDC, '100')).reserveOf(USDC)
      ).toEqual(CurrencyAmount.fromRawAmount(USDC, '100'))
    })

    it('throws if not in the pair', () => {
      expect(() =>
        new Pair(CurrencyAmount.fromRawAmount(DAI, '101'), CurrencyAmount.fromRawAmount(USDC, '100')).reserveOf(
          WNATIVE[ChainId.BSC]
        )
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(
        new Pair(CurrencyAmount.fromRawAmount(USDC, '100'), CurrencyAmount.fromRawAmount(DAI, '100')).chainId
      ).toEqual(ChainId.BSC)
      expect(
        new Pair(CurrencyAmount.fromRawAmount(DAI, '100'), CurrencyAmount.fromRawAmount(USDC, '100')).chainId
      ).toEqual(ChainId.BSC)
    })
  })
  describe('#involvesToken', () => {
    expect(
      new Pair(CurrencyAmount.fromRawAmount(USDC, '100'), CurrencyAmount.fromRawAmount(DAI, '100')).involvesToken(USDC)
    ).toEqual(true)
    expect(
      new Pair(CurrencyAmount.fromRawAmount(USDC, '100'), CurrencyAmount.fromRawAmount(DAI, '100')).involvesToken(DAI)
    ).toEqual(true)
    expect(
      new Pair(CurrencyAmount.fromRawAmount(USDC, '100'), CurrencyAmount.fromRawAmount(DAI, '100')).involvesToken(
        WNATIVE[ChainId.BSC]
      )
    ).toEqual(false)
  })
})
