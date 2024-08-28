import { ChainId, Pair } from '@pancakeswap/sdk'
import { Pool } from '@pancakeswap/v3-sdk'
import groupBy from 'lodash/groupBy'
import { Address, createPublicClient, http, isAddressEqual, parseAbiItem } from 'viem'
import { arbitrum, bsc } from 'viem/chains'
import { describe, expect, test } from 'vitest'
import { UNIVERSAL_BCAKEWRAPPER_FARMS, UNIVERSAL_FARMS } from '.'
import { BCakeWrapperFarmConfig, UniversalFarmConfigV3 } from '../types'

const bscClient = createPublicClient({
  chain: bsc,
  transport: http(),
})
const arbClient = createPublicClient({
  chain: arbitrum,
  transport: http(),
})

describe.concurrent('Universal Farms config', () => {
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
      UNIVERSAL_FARMS.filter((farm) => farm.protocol === 'stable'),
      'chainId',
    )

    for await (const [chainId, farms] of Object.entries(ssFarms)) {
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
      UNIVERSAL_FARMS.filter((farm) => farm.protocol !== 'stable'),
      'protocol',
    )
    for (const [protocol, config] of Object.entries(othersFarms)) {
      config.forEach((farm) => {
        const lpAddress =
          protocol === 'v2'
            ? Pair.getAddress(farm.token0, farm.token1)
            : Pool.getAddress(farm.token0, farm.token1, (farm as UniversalFarmConfigV3).feeAmount)
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

describe('Universal bCakeWrapper farms config', () => {
  const getMatchedFarmConfig = (bCakeFarmConfig: BCakeWrapperFarmConfig) => {
    return UNIVERSAL_FARMS.find((farm) => {
      return farm.chainId === bCakeFarmConfig.chainId && farm.lpAddress === bCakeFarmConfig.lpAddress
    })
  }

  test('bCakeWrapper farms should match with v2/ss farms', async () => {
    const configByChainId = groupBy(UNIVERSAL_BCAKEWRAPPER_FARMS, 'chainId')
    const tokens: Address[] = []
    for await (const [chainId, farms] of Object.entries(configByChainId)) {
      const client = Number(chainId) === ChainId.BSC ? bscClient : arbClient

      const tokensCalls = farms.reduce((calls, farm) => {
        return [
          ...calls,
          // {
          //   address: farm.bCakeWrapperAddress,
          //   functionName: 'rewardToken',
          //   abi: [parseAbiItem('function rewardToken() view returns (address)')],
          // },
          {
            address: farm.bCakeWrapperAddress,
            functionName: 'stakedToken',
            abi: [parseAbiItem('function stakedToken() view returns (address)')],
          },
        ]
      }, [] as unknown[])

      tokens.push(
        ...((await client.multicall({
          contracts: tokensCalls as any,
          allowFailure: false,
        })) as Address[]),
      )
    }

    UNIVERSAL_BCAKEWRAPPER_FARMS.forEach((bCakeFarmConfig, index) => {
      const matchedFarmConfig = getMatchedFarmConfig(bCakeFarmConfig)
      expect(
        matchedFarmConfig,
        `No matched farm config for bCakeWrapper farm ${bCakeFarmConfig.lpAddress}`,
      ).toBeDefined()
      const stakingToken = tokens[index]

      expect(isAddressEqual(stakingToken, matchedFarmConfig!.lpAddress)).toBe(true)
    })
  })
})
