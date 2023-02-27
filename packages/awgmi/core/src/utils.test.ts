import { describe, expect, it } from 'vitest'
import {
  isAccountAddress,
  unwrapTypeArgFromString,
  unwrapTypeFromString,
  isHexStringEquals,
  parseVmStatusError,
  isStructTag,
} from './utils'

describe('utils isAccountAddress', () => {
  const validCases = [
    '0x1',
    '0x0000001',
    '0x912387',
    '0x2cf744dc90acb87c3bbf5f034b37c3718ac10a56e5181c1b43923e5c3623b493',
  ]
  it.each(validCases)('should valid', (value) => {
    expect(isAccountAddress(value)).toBeTruthy()
  })

  const invalidCases = ['123123', '02312', '0x1::aptos_coin:AptosCoin', 'apt']

  it.each(invalidCases)('should invalid', (value) => {
    expect(isAccountAddress(value)).toBeFalsy()
  })
})

describe('utils unwrapStrutTagTypeArgFromString', () => {
  const resourceTypes = [
    '0x1::code::PackageRegistry',
    '0x1::coin::CoinInfo<0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea::swap::LPToken<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetETH>>',
    '0x1::coin::CoinInfo<0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea::swap::LPToken<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL>>',
    '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>',
    '0x1::coin::CoinStore<0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea::swap::LPToken<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetETH>>',
    '0x1::coin::CoinStore<0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea::swap::LPToken<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL>>',
    '0x1::account::Account',
    '0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea::swap::SwapInfo',
    '0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea::swap::PairEventHolder<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetETH>',
    '0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea::swap::PairEventHolder<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL>',
    '0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea::swap::TokenPairReserve<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetETH>',
    '0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea::swap::TokenPairReserve<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL>',
    '0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea::swap::TokenPairMetadata<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetETH>',
    '0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea::swap::TokenPairMetadata<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL>',
  ]

  it('should unwrap', () => {
    expect(resourceTypes.map(unwrapTypeArgFromString)).toMatchInlineSnapshot(
      `
      [
        undefined,
        "0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetETH",
        "0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL",
        "0x1::aptos_coin::AptosCoin",
        "0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetETH",
        "0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL",
        undefined,
        undefined,
        "0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetETH",
        "0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL",
        "0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetETH",
        "0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL",
        "0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetETH",
        "0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL",
      ]
    `,
    )
  })

  it('should unwrap', () => {
    expect(resourceTypes.map(unwrapTypeFromString)).toMatchInlineSnapshot(
      `
      [
        undefined,
        "0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea::swap::LPToken<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetETH>",
        "0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea::swap::LPToken<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL>",
        "0x1::aptos_coin::AptosCoin",
        "0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea::swap::LPToken<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetETH>",
        "0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea::swap::LPToken<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL>",
        undefined,
        undefined,
        "0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetETH",
        "0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL",
        "0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetETH",
        "0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL",
        "0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetETH",
        "0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetSOL",
      ]
    `,
    )
  })
})

describe('isStructTag', () => {
  it('should return true if StructTag', () => {
    expect(
      isStructTag('0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC'),
    ).toBeTruthy()
    expect(isStructTag('0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::')).toBeFalsy()
    expect(isStructTag('0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins')).toBeFalsy()
    expect(isStructTag('0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::')).toBeFalsy()
    expect(isStructTag('0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf')).toBeFalsy()
  })
})

describe('isHexStringEquals', () => {
  it('is equals', () => {
    expect(isHexStringEquals('0x123', '0x0000123')).toBeTruthy()
    expect(isHexStringEquals('0x123', '0x0003123')).toBeFalsy()
    expect(isHexStringEquals('0x123', '0x1::aptos_coin::AptosCoin')).toBeFalsy()
    expect(isHexStringEquals('0x00000000001::aptos_coin::AptosCoin', '0x1::aptos_coin::AptosCoin')).toBeTruthy()
  })
})

describe('parseVmStatusError', () => {
  it('parse', () => {
    expect(
      parseVmStatusError(
        'Move abort in 0x1::coin: EINSUFFICIENT_BALANCE(0x10006): Not enough coins to complete transaction',
      ),
    ).toMatchInlineSnapshot(`
      {
        "code": 65542,
        "message": "Not enough coins to complete transaction",
        "module": "0x1::coin",
        "reason": "EINSUFFICIENT_BALANCE",
      }
    `)
  })
})
