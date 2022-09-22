import { Coin } from './coin'
import { ChainId } from './constants'
import { Pair } from './pair'
import { AptosCoin } from './aptosCoin'

const coinA = '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC'
const coinB = '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL'

describe('Pair', () => {
  it('should match Pair address', () => {
    expect(
      Pair.getAddress(new Coin(ChainId.DEVNET, coinA, 8, 'BTC'), AptosCoin.onChain(ChainId.DEVNET).wrapped)
    ).toMatchInlineSnapshot(
      `"0xca498e78eca95ade4015b82f43c4cfe3aa66ea9b702b79234057add94c9cf2d::swap::LPToken<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x1::aptos_coin::AptosCoin>"`
    )

    expect(
      Pair.getAddress(new Coin(ChainId.DEVNET, coinA, 8, 'BTC'), new Coin(ChainId.DEVNET, coinB, 8, 'SOL'))
    ).toMatchInlineSnapshot(
      `"0xca498e78eca95ade4015b82f43c4cfe3aa66ea9b702b79234057add94c9cf2d::swap::LPToken<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC>"`
    )
  })

  it('should match Pair Reserves address', () => {
    expect(
      Pair.getReservesAddress(new Coin(ChainId.DEVNET, coinA, 8, 'BTC'), AptosCoin.onChain(ChainId.DEVNET).wrapped)
    ).toMatchInlineSnapshot(
      `"0xca498e78eca95ade4015b82f43c4cfe3aa66ea9b702b79234057add94c9cf2d::swap::TokenPairReserve<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x1::aptos_coin::AptosCoin>"`
    )

    expect(
      Pair.getReservesAddress(new Coin(ChainId.DEVNET, coinA, 8, 'BTC'), new Coin(ChainId.DEVNET, coinB, 8, 'SOL'))
    ).toMatchInlineSnapshot(
      `"0xca498e78eca95ade4015b82f43c4cfe3aa66ea9b702b79234057add94c9cf2d::swap::TokenPairReserve<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC>"`
    )
  })
})
