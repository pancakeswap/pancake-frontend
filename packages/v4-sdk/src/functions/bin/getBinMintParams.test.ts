import { describe, expect, test } from 'vitest'
import { getBinMintParams } from './getBinMintParams'

describe('getBinMintParams', () => {
  test('should return the correct result', () => {
    const result = getBinMintParams({
      binId: 8363961,
      amountX: 120000000000000000000n,
      amountY: 2400000000n,
      nbBinX: 6,
      nbBinY: 6,
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "amountIn": [
          120000000000000000000n,
          2400000000n,
        ],
        "liquidityConfigs": [
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
        ],
      }
    `)
  })
})
