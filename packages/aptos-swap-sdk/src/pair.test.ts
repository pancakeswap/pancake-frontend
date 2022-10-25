import { CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import { AptosCoin } from './aptosCoin'
import { Coin } from './coin'
import { ChainId } from './constants'
import { Pair } from './pair'

const coinAAddress = '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC'
const coinA = new Coin(ChainId.TESTNET, coinAAddress, 8, 'BTC')
const coinBAddress = '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL'
const coinB = new Coin(ChainId.TESTNET, coinBAddress, 8, 'SOL')

describe('Pair', () => {
  it('should match Pair address', () => {
    const pair1 = Pair.getAddress(coinA, AptosCoin.onChain(ChainId.TESTNET).wrapped)
    expect(pair1).toMatchInlineSnapshot(
      '"0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x1::aptos_coin::AptosCoin, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC>"'
    )

    expect(Pair.getAddress(coinA, coinB)).toMatchInlineSnapshot(
      '"0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL>"'
    )
    expect(Pair.getAddress(coinB, coinA)).toMatchInlineSnapshot(
      '"0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL>"'
    )
  })

  it('should match Pair Reserves address', () => {
    expect(Pair.getReservesAddress(coinA, AptosCoin.onChain(ChainId.TESTNET).wrapped)).toMatchInlineSnapshot(
      '"0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::TokenPairReserve<0x1::aptos_coin::AptosCoin, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC>"'
    )

    expect(Pair.getReservesAddress(coinA, coinB)).toMatchInlineSnapshot(
      '"0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::TokenPairReserve<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL>"'
    )

    expect(Pair.getReservesAddress(coinB, coinA)).toMatchInlineSnapshot(
      '"0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::TokenPairReserve<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL>"'
    )
  })

  it('should match LiquidityToken', () => {
    expect(
      new Pair(CurrencyAmount.fromRawAmount(coinA, '100'), CurrencyAmount.fromRawAmount(coinB, '200')).liquidityToken
    ).toMatchInlineSnapshot(`
      Coin {
        "address": "0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL>",
        "chainId": 2,
        "decimals": 8,
        "isNative": false,
        "isToken": true,
        "name": "Pancake-BTC-SOL-LP",
        "projectLink": undefined,
        "symbol": "Cake-LP",
      }
    `)
  })
})
