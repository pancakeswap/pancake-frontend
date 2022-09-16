import { ChainId, Coin } from '.'

describe('Coin', () => {
  const ADDRESS_ONE = '0x1475ddbffb8e29a32223e1e25b8459d03a5ddd94e1cb7a50bb7051e11ba0cb2f::moon_coin::MoonCoin'
  const ADDRESS_TWO = '0x1475ddbffb8e29a32223e1e25b8459d03a5ddd94e1cb7a50bb7051e11ba0cb2f::cake_coin::CakeCoin'

  describe('#equals', () => {
    it('fails if address differs', () => {
      expect(
        new Coin(ChainId.DEVNET, ADDRESS_ONE, 18, 'CAKE').equals(new Coin(ChainId.DEVNET, ADDRESS_TWO, 18, 'CAKE'))
      ).toBe(false)
    })

    it('false if chain id differs', () => {
      expect(
        new Coin(ChainId.AIT3, ADDRESS_ONE, 18, 'CAKE').equals(new Coin(ChainId.DEVNET, ADDRESS_ONE, 18, 'CAKE'))
      ).toBe(false)
    })

    it('true if only decimals differs', () => {
      expect(
        new Coin(ChainId.DEVNET, ADDRESS_ONE, 9, 'CAKE').equals(new Coin(ChainId.DEVNET, ADDRESS_ONE, 18, 'CAKE'))
      ).toBe(true)
    })

    it('true if address is the same', () => {
      expect(
        new Coin(ChainId.DEVNET, ADDRESS_ONE, 18, 'CAKE').equals(new Coin(ChainId.DEVNET, ADDRESS_ONE, 18, 'CAKE'))
      ).toBe(true)
    })

    it('true on reference equality', () => {
      const token = new Coin(ChainId.DEVNET, ADDRESS_ONE, 18, 'CAKE')
      expect(token.equals(token)).toBe(true)
    })

    it('true even if name/symbol/decimals/projectLink differ', () => {
      const tokenA = new Coin(ChainId.DEVNET, ADDRESS_ONE, 9, 'abc', 'def', 'https://www.binance.org/')
      const tokenB = new Coin(ChainId.DEVNET, ADDRESS_ONE, 18, 'ghi', 'jkl', 'https://coinmarketcap.com/')
      expect(tokenA.equals(tokenB)).toBe(true)
    })
  })
})
