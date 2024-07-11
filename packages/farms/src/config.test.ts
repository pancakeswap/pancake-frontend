import { ChainId, Pair } from '@pancakeswap/sdk'
import { Pool } from '@pancakeswap/v3-sdk'
import groupBy from 'lodash/groupBy'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { arbitrum, bsc } from 'viem/chains'
import { describe, expect, test } from 'vitest'
import { FarmConfigV3, UNIVERSAL_FARMS } from './config'

const STABLE_SWAP_LP_FACTORY = {
  [ChainId.BSC]: '0x1179ADfa22dD0e5050C1c00C9f8543A77F75A2c0',
  [ChainId.ARBITRUM_ONE]: '0x5D5fBB19572c4A89846198c3DBEdB2B6eF58a77a',
} as const

const bscClient = createPublicClient({
  chain: bsc,
  transport: http(),
})
const arbClient = createPublicClient({
  chain: arbitrum,
  transport: http(),
})

describe('Universal Farms config', () => {
  test('pid/lpAddress should be unique', () => {
    const configByChains = groupBy(UNIVERSAL_FARMS, 'chainId')

    for (const [chainId, config] of Object.entries(configByChains)) {
      config.forEach((farm, index) => {
        const duplicatePid = config.filter((f, i) => f.pid === farm.pid && i !== index && f.protocol === farm.protocol)
        expect(
          duplicatePid,
          `Duplicate pid ${farm.pid}:${farm.protocol}:${farm.lpAddress} on chain ${chainId}`,
        ).toEqual([])
        const duplicateLp = config.filter(
          (f, i) => f.lpAddress === farm.lpAddress && i !== index && f.protocol === farm.protocol,
        )
        expect(
          duplicateLp,
          `Duplicate lpAddress ${farm.pid}:${farm.protocol}:${farm.lpAddress} on chain ${chainId}`,
        ).toEqual([])
      })
    }
  })

  test('stable lpAddress should be correct', async () => {
    const ssFarms = groupBy(
      UNIVERSAL_FARMS.filter((farm) => farm.protocol === 'stableswap'),
      'chainId',
    )

    for await (const [chainId, farms] of Object.entries(ssFarms)) {
      const factory = STABLE_SWAP_LP_FACTORY[chainId as unknown as keyof typeof STABLE_SWAP_LP_FACTORY]
      expect(factory, `Missing stableswap factory for chain ${chainId}`).toBeDefined()
      const client = Number(chainId) === ChainId.BSC ? bscClient : arbClient

      const minterCalls = farms.map((farm) => ({
        address: farm.lpAddress,
        functionName: 'minter',
        abi: [parseAbiItem('function minter() view returns (address)')],
      }))
      const minters = await client.multicall({
        contracts: minterCalls,
        allowFailure: false,
      })
      expect(minters.length).toBe(farms.length)
      const coinsCall = minters.reduce((calls, minter) => {
        return [
          ...calls,
          {
            address: minter,
            functionName: 'coins',
            abi: [parseAbiItem('function coins(uint256) view returns (address)')],
            args: [0],
          },
          {
            address: minter,
            functionName: 'coins',
            abi: [parseAbiItem('function coins(uint256) view returns (address)')],
            args: [1],
          },
        ]
      }, [] as unknown[])
      const coins = await client.multicall({
        contracts: coinsCall as any,
        allowFailure: false,
      })
      farms.forEach((farm, index) => {
        const token0 = coins[index * 2]
        const token1 = coins[index * 2 + 1]
        expect(token0, `wrong stable pool coin0, ${farm.chainId}:${farm.pid}:${farm.lpAddress}`).toEqual(
          farm.token0.address,
        )
        expect(token1, `wrong stable pool coin1, ${farm.chainId}:${farm.pid}:${farm.lpAddress}`).toEqual(
          farm.token1.address,
        )
      })
    }
  })

  test('v2/v3 lpAddress should be correct', async () => {
    const othersFarms = groupBy(
      UNIVERSAL_FARMS.filter((farm) => farm.protocol !== 'stableswap'),
      'protocol',
    )
    for (const [protocol, config] of Object.entries(othersFarms)) {
      config.forEach((farm) => {
        const lpAddress =
          protocol === 'v2'
            ? Pair.getAddress(farm.token0, farm.token1)
            : Pool.getAddress(farm.token0, farm.token1, (farm as FarmConfigV3).feeAmount)
        expect(
          lpAddress,
          `Wrong lpAddress for farm ${farm.chainId}:${farm.pid}:${farm.protocol}:${farm.lpAddress}, expected ${lpAddress}`,
        ).toBe(farm.lpAddress)
      })
    }
  })

  test('token order should be correct', () => {
    for (const farm of UNIVERSAL_FARMS) {
      if (farm.token0.isNative) continue
      expect(farm.token1.isNative).toBe(false)
      expect(
        farm.token0.sortsBefore(farm.token1),
        `
Wrong token order for farm ${farm.pid}:${farm.protocol}:${farm.lpAddress}:
token0: ${farm.token0.address}
token1: ${farm.token1.address}
        `,
      ).toBe(true)
    }
  })
})
