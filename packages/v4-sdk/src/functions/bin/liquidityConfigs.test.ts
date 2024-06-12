import { describe, expect, test } from 'vitest'
import { decodeLiquidityConfig, encodeLiquidityConfig } from './liquidityConfigs'

describe('LiquidityConfigs', () => {
  test('encode', () => {
    const distributionX = 2466771047569n
    const distributionY = 1361165211822188n
    const id = 16777213n
    const result = encodeLiquidityConfig({ distributionX, distributionY, id })
    expect(result).toBe('0x000000000000000000000000000000023e570314910004d5f8f8ee686cfffffd')
  })

  test('decode', () => {
    const config = '0x000000000000000000000000000000023e570314910004d5f8f8ee686cfffffd'

    const result = decodeLiquidityConfig(config)

    expect(result).toEqual({
      distributionX: 2466771047569n,
      distributionY: 1361165211822188n,
      id: 16777213n,
    })
  })
})
