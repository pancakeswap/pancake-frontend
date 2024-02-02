import { describe, expect, it } from 'vitest'
import { AptosCoin, ChainId, Coin } from '.'

describe('Coin', () => {
  const ADDRESS_ONE = '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC'
  const ADDRESS_TWO = '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL'

  const ADDRESS_USDC = '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetUSDC'
  const ADDRESS_BUSD = '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBUSD'
  const ADDRESS_BNB = '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBNB'

  describe('#equals', () => {
    it('fails if address differs', () => {
      expect(
        new Coin(ChainId.TESTNET, ADDRESS_ONE, 18, 'CAKE').equals(new Coin(ChainId.TESTNET, ADDRESS_TWO, 18, 'CAKE'))
      ).toBe(false)
    })

    it('false if chain id differs', () => {
      expect(
        new Coin(ChainId.MAINNET, ADDRESS_ONE, 18, 'CAKE').equals(new Coin(ChainId.TESTNET, ADDRESS_ONE, 18, 'CAKE'))
      ).toBe(false)
    })

    it('true if only decimals differs', () => {
      expect(
        new Coin(ChainId.TESTNET, ADDRESS_ONE, 9, 'CAKE').equals(new Coin(ChainId.TESTNET, ADDRESS_ONE, 18, 'CAKE'))
      ).toBe(true)
    })

    it('true if address is the same', () => {
      expect(
        new Coin(ChainId.TESTNET, ADDRESS_ONE, 18, 'CAKE').equals(new Coin(ChainId.TESTNET, ADDRESS_ONE, 18, 'CAKE'))
      ).toBe(true)
    })

    it('true on reference equality', () => {
      const token = new Coin(ChainId.TESTNET, ADDRESS_ONE, 18, 'CAKE')
      expect(token.equals(token)).toBe(true)
    })

    it('true even if name/symbol/decimals/projectLink differ', () => {
      const tokenA = new Coin(ChainId.TESTNET, ADDRESS_ONE, 9, 'abc', 'def', 'https://www.binance.org/')
      const tokenB = new Coin(ChainId.TESTNET, ADDRESS_ONE, 18, 'ghi', 'jkl', 'https://coinmarketcap.com/')
      expect(tokenA.equals(tokenB)).toBe(true)
    })

    it('sortBefore', () => {
      const tokenA = new Coin(ChainId.TESTNET, ADDRESS_ONE, 8, 'BTC')
      const tokenB = new Coin(ChainId.TESTNET, ADDRESS_TWO, 8, 'SOL')

      expect(tokenA.sortsBefore(tokenB)).toBe(true)

      const usdc = new Coin(ChainId.TESTNET, ADDRESS_USDC, 8, 'USDC')
      const busd = new Coin(ChainId.TESTNET, ADDRESS_BUSD, 8, 'BUSD')
      expect(usdc.sortsBefore(busd)).toBe(false)

      const bnb = new Coin(ChainId.TESTNET, ADDRESS_BNB, 8, 'BNB')
      expect(bnb.sortsBefore(busd)).toBe(true)

      expect(AptosCoin.onChain(ChainId.TESTNET).sortsBefore(tokenA)).toBe(true)

      expect(
        new Coin(ChainId.TESTNET, '0x16::test_coins::TestBNB', 8, '').sortsBefore(
          new Coin(ChainId.TESTNET, '0x123123123::swap_utils::TestBNB', 8, '')
        )
      ).toBe(false)

      expect(
        new Coin(ChainId.TESTNET, '0x16::pancake::CAKE', 8, '').sortsBefore(
          new Coin(ChainId.TESTNET, '0x16::devnet_coins::DevnetBTC', 8, '')
        )
      ).toBe(false)

      expect(
        new Coin(ChainId.TESTNET, '0x16::FO::OBAR', 8, '').sortsBefore(
          new Coin(ChainId.TESTNET, '0x16::FOO::BAR', 8, '')
        )
      ).toBe(true)
    })

    it('correct address', () => {
      const tokenA = new Coin(ChainId.TESTNET, ADDRESS_ONE, 8, 'BTC')
      const tokenB = new Coin(ChainId.TESTNET, ADDRESS_TWO, 8, 'SOL')

      expect(tokenA.address).toBe(ADDRESS_ONE)
      expect(tokenB.address).toBe(ADDRESS_TWO)
    })
  })
})
