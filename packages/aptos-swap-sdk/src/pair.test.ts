import { CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import { AptosCoin } from './aptosCoin'
import { Coin } from './coin'
import { ChainId } from './constants'
import { Pair } from './pair'

const coinAAddress = '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC'
const coinA = new Coin(ChainId.DEVNET, coinAAddress, 8, 'BTC')
const coinBAddress = '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL'
const coinB = new Coin(ChainId.DEVNET, coinBAddress, 8, 'SOL')

const PAIR_LP_TYPE_TAG = `0x540bc17b2ddcf44abcff62b9a1939e23cdec44a6078e98ca79fcc98253ac354d::storage::LPToken`
const PAIR_RESERVE_TYPE_TAG = `0xcdfdd85820f4a66ba6589620105746d5a2202906cf78e718af159c07a0520151::swap::TokenPairReserve`

describe('Pair', () => {
  it('should match Pair address', () => {
    const pair1 = Pair.getAddress(coinA, AptosCoin.onChain(ChainId.DEVNET).wrapped)
    expect(pair1).toMatchInlineSnapshot(
      `"${PAIR_LP_TYPE_TAG}<0x1::aptos_coin::AptosCoin, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC>"`
    )

    expect(Pair.getAddress(coinA, coinB)).toMatchInlineSnapshot(
      `"${PAIR_LP_TYPE_TAG}<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL>"`
    )
    expect(Pair.getAddress(coinB, coinA)).toMatchInlineSnapshot(
      `"${PAIR_LP_TYPE_TAG}<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL>"`
    )
  })

  it('should match Pair Reserves address', () => {
    expect(Pair.getReservesAddress(coinA, AptosCoin.onChain(ChainId.DEVNET).wrapped)).toMatchInlineSnapshot(
      `"${PAIR_RESERVE_TYPE_TAG}<0x1::aptos_coin::AptosCoin, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC>"`
    )

    expect(Pair.getReservesAddress(coinA, coinB)).toMatchInlineSnapshot(
      `"${PAIR_RESERVE_TYPE_TAG}<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL>"`
    )

    expect(Pair.getReservesAddress(coinB, coinA)).toMatchInlineSnapshot(
      `"${PAIR_RESERVE_TYPE_TAG}<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL>"`
    )
  })

  it('should match LiquidityToken', () => {
    expect(
      new Pair(CurrencyAmount.fromRawAmount(coinA, '100'), CurrencyAmount.fromRawAmount(coinB, '200')).liquidityToken
    ).toMatchInlineSnapshot(`
      Coin {
        "address": "${PAIR_LP_TYPE_TAG}<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL>",
        "chainId": 32,
        "decimals": 8,
        "isNative": false,
        "isToken": true,
        "name": "Pancake LPs",
        "projectLink": undefined,
        "symbol": "Cake-LP",
      }
    `)
  })
})
