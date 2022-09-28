import { CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import { AptosCoin } from './aptosCoin'
import { Coin } from './coin'
import { ChainId } from './constants'
import { Pair } from './pair'

const coinAAddress = '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC'
const coinA = new Coin(ChainId.DEVNET, coinAAddress, 8, 'BTC')
const coinBAddress = '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL'
const coinB = new Coin(ChainId.DEVNET, coinBAddress, 8, 'SOL')

describe('Pair', () => {
  it('should match Pair address', () => {
    const pair1 = Pair.getAddress(coinA, AptosCoin.onChain(ChainId.DEVNET).wrapped)
    expect(pair1).toMatchInlineSnapshot(
      '"0x4989a662eed18e34e697985cffeae08aadce14b7483ebe0b3ad37622057d8231::storage::LPToken<0x1::aptos_coin::AptosCoin, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC>"'
    )

    expect(Pair.getAddress(coinA, coinB)).toMatchInlineSnapshot(
      '"0x4989a662eed18e34e697985cffeae08aadce14b7483ebe0b3ad37622057d8231::storage::LPToken<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL>"'
    )
    expect(Pair.getAddress(coinB, coinA)).toMatchInlineSnapshot(
      '"0x4989a662eed18e34e697985cffeae08aadce14b7483ebe0b3ad37622057d8231::storage::LPToken<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL>"'
    )
  })

  it('should match Pair Reserves address', () => {
    expect(Pair.getReservesAddress(coinA, AptosCoin.onChain(ChainId.DEVNET).wrapped)).toMatchInlineSnapshot(
      '"0xc23db0e6419eec6786f0faa9642907e12e88b18ad1e8b9910f53935caff59d2d::swap::TokenPairReserve<0x1::aptos_coin::AptosCoin, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC>"'
    )

    expect(Pair.getReservesAddress(coinA, coinB)).toMatchInlineSnapshot(
      '"0xc23db0e6419eec6786f0faa9642907e12e88b18ad1e8b9910f53935caff59d2d::swap::TokenPairReserve<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL>"'
    )

    expect(Pair.getReservesAddress(coinB, coinA)).toMatchInlineSnapshot(
      '"0xc23db0e6419eec6786f0faa9642907e12e88b18ad1e8b9910f53935caff59d2d::swap::TokenPairReserve<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL>"'
    )
  })

  it('should match LiquidityToken', () => {
    expect(
      new Pair(CurrencyAmount.fromRawAmount(coinA, '100'), CurrencyAmount.fromRawAmount(coinB, '200')).liquidityToken
    ).toMatchInlineSnapshot(`
      Coin {
        "address": "0x4989a662eed18e34e697985cffeae08aadce14b7483ebe0b3ad37622057d8231::storage::LPToken<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL>",
        "chainId": 31,
        "decimals": 18,
        "isNative": false,
        "isToken": true,
        "name": "Pancake LPs",
        "projectLink": undefined,
        "symbol": "Cake-LP",
      }
    `)
  })
})
