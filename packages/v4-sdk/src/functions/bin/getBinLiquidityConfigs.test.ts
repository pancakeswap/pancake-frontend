import { describe, expect, test } from 'vitest'
import { getBinLiquidityConfigs } from './getBinLiquidityConfigs'

describe('getBinLiquidityConfigs', () => {
  test('should return the correct result', () => {
    const result = getBinLiquidityConfigs({
      binId: 8363961,
      nbBinX: 6,
      nbBinY: 6,
    })
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "distributionX": 0n,
          "distributionY": 166666666666666666n,
          "id": 8363956n,
        },
        {
          "distributionX": 0n,
          "distributionY": 166666666666666666n,
          "id": 8363957n,
        },
        {
          "distributionX": 0n,
          "distributionY": 166666666666666666n,
          "id": 8363958n,
        },
        {
          "distributionX": 0n,
          "distributionY": 166666666666666666n,
          "id": 8363959n,
        },
        {
          "distributionX": 0n,
          "distributionY": 166666666666666666n,
          "id": 8363960n,
        },
        {
          "distributionX": 166666666666666666n,
          "distributionY": 166666666666666666n,
          "id": 8363961n,
        },
        {
          "distributionX": 166666666666666666n,
          "distributionY": 0n,
          "id": 8363962n,
        },
        {
          "distributionX": 166666666666666666n,
          "distributionY": 0n,
          "id": 8363963n,
        },
        {
          "distributionX": 166666666666666666n,
          "distributionY": 0n,
          "id": 8363964n,
        },
        {
          "distributionX": 166666666666666666n,
          "distributionY": 0n,
          "id": 8363965n,
        },
        {
          "distributionX": 166666666666666666n,
          "distributionY": 0n,
          "id": 8363966n,
        },
      ]
    `)
  })
})
