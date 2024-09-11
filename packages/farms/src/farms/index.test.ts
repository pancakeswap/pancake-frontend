import { ChainId, Pair } from '@pancakeswap/sdk'
import { Pool } from '@pancakeswap/v3-sdk'
import groupBy from 'lodash/groupBy'
import { createPublicClient, fallback, getAddress, http, parseAbiItem, PublicClient } from 'viem'
import * as CHAINS from 'viem/chains'
import { describe, expect, test } from 'vitest'
import { UNIVERSAL_FARMS } from '.'
import { masterChefV3Addresses, supportedChainIdV4 } from '../const'
import { UniversalFarmConfig, UniversalFarmConfigV3 } from '../types'

const PUBLIC_NODES: Record<string, string[]> = {
  [ChainId.ARBITRUM_ONE]: [
    CHAINS.arbitrum.rpcUrls.default.http[0],
    'https://arbitrum-one.publicnode.com',
    'https://arbitrum.llamarpc.com',
  ],
  [ChainId.ETHEREUM]: [
    CHAINS.mainnet.rpcUrls.default.http[0],
    'https://ethereum.publicnode.com',
    'https://eth.llamarpc.com',
  ],
}

const getTestLpSymbol = (farm: UniversalFarmConfig) => {
  return `${farm.chainId}:${farm.protocol}:${farm.token0.symbol}/${farm.token1.symbol}${
    farm.protocol === 'v3' ? ` fee ${farm.feeAmount}` : ''
  }`
}

const publicClient: Record<string, PublicClient> = supportedChainIdV4.reduce((acc, chainId) => {
  const node = PUBLIC_NODES[chainId]
  return {
    ...acc,
    [chainId]: createPublicClient({
      chain: Object.values(CHAINS).find((chain) => chain.id === Number(chainId)),
      transport: node ? fallback(node.map((rpc: string) => http(rpc))) : http(),
    }) as PublicClient,
  }
}, {} as Record<string, PublicClient>)

describe.concurrent(
  'Universal Farms config',
  () => {
    test('lpAddress should be unique', () => {
      const configByChains = groupBy(UNIVERSAL_FARMS, 'chainId')

      for (const [chainId, config] of Object.entries(configByChains)) {
        config.forEach((farm, index) => {
          const duplicateLp = config.filter(
            (f, i) => f.lpAddress === farm.lpAddress && i !== index && f.protocol === farm.protocol,
          )
          expect(duplicateLp, `Duplicate lpAddress ${getTestLpSymbol(farm)} on chain ${chainId}`).toEqual([])
        })
      }
    })

    test('v3 pid should be unique', () => {
      const configByChains = groupBy(UNIVERSAL_FARMS, 'chainId')

      for (const [chainId, config] of Object.entries(configByChains)) {
        const v3Config = config.filter((farm) => farm.protocol === 'v3')
        v3Config.forEach((farm, index) => {
          const duplicatePid = v3Config.filter((f, i) => f.pid === farm.pid && i !== index)
          expect(duplicatePid, `Duplicate v3 pid ${getTestLpSymbol(farm)} on chain ${chainId}`).toEqual([])
        })
      }
    })

    test('v3 pid should be correct', async () => {
      const configByChains = groupBy(UNIVERSAL_FARMS, 'chainId')

      for await (const [chainId, configs_] of Object.entries(configByChains)) {
        const client = publicClient[chainId]
        const masterChefAddress = masterChefV3Addresses[Number(chainId) as keyof typeof masterChefV3Addresses]
        if (!masterChefAddress) throw new Error(`No masterChefAddress for chain ${chainId}`)
        const configs = configs_.filter((farm) => farm.protocol === 'v3')

        const pidCalls = configs.map((farm) => ({
          address: masterChefAddress,
          functionName: 'v3PoolAddressPid',
          abi: [parseAbiItem('function v3PoolAddressPid(address) view returns (uint256)')],
          args: [farm.lpAddress],
        }))
        const pids = await client.multicall({
          contracts: pidCalls,
          allowFailure: false,
        })
        configs.forEach((farm, index) => {
          expect(pids[index], `wrong pid ${getTestLpSymbol(farm)}`).toEqual(BigInt(farm.pid))
        })
      }
    })

    test('v2/ss bCakeWrapperAddress should be unique', () => {
      const configByChains = groupBy(UNIVERSAL_FARMS, 'chainId')

      for (const [chainId, config] of Object.entries(configByChains)) {
        const v2Config = config.filter((farm) => farm.protocol === 'v2' || farm.protocol === 'stable')
        v2Config.forEach((farm, index) => {
          const duplicateBCake = v2Config.filter(
            (f, i) => f.bCakeWrapperAddress === farm.bCakeWrapperAddress && i !== index,
          )
          expect(duplicateBCake, `Duplicate bCakeWrapperAddress ${getTestLpSymbol(farm)} on chain ${chainId}`).toEqual(
            [],
          )
        })
      }
    })

    test('v2/ss bCakeWrapperAddress should be correct', async () => {
      const configByChains = groupBy(UNIVERSAL_FARMS, 'chainId')

      for await (const [chainId, configs_] of Object.entries(configByChains)) {
        const client = publicClient[chainId]
        const configs = configs_.filter((farm) => farm.protocol === 'v2' || farm.protocol === 'stable')

        const lpAddressCalls = configs.map((farm) => ({
          address: farm.bCakeWrapperAddress,
          functionName: 'stakedToken',
          abi: [parseAbiItem('function stakedToken() view returns (address)')],
        }))
        const lpAddresses = await client.multicall({
          contracts: lpAddressCalls,
          allowFailure: false,
        })
        configs.forEach((farm, index) => {
          expect(getAddress(lpAddresses[index]), `wrong bCakeWrapperAddress ${getTestLpSymbol(farm)}`).toEqual(
            farm.lpAddress,
          )
        })
      }
    })

    test('stable lpAddress/stableSwapAddress should be correct', async () => {
      const ssFarms = groupBy(
        UNIVERSAL_FARMS.filter((farm) => farm.protocol === 'stable'),
        'chainId',
      )

      for await (const [chainId, farms] of Object.entries(ssFarms)) {
        const client = publicClient[chainId]

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
        minters.forEach((minter, index) => {
          expect(getAddress(minter), `wrong stableSwapAddress, ${getTestLpSymbol(farms[index])}`).toEqual(
            farms[index].stableSwapAddress,
          )
        })
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
          expect(token0, `wrong stable pool coin0, ${getTestLpSymbol(farm)}`).toEqual(farm.token0.address)
          expect(token1, `wrong stable pool coin1, ${getTestLpSymbol(farm)}`).toEqual(farm.token1.address)
        })
      }
    })

    test('(v2 lpAddress) & (v3 lpAddress, feeAmount) should be correct', async () => {
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
          expect(lpAddress, `Wrong lpAddress for farm ${getTestLpSymbol(farm)}, expected ${lpAddress}`).toBe(
            farm.lpAddress,
          )
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
Wrong token order for farm ${getTestLpSymbol(farm)}:
token0: ${farm.token0.address}
token1: ${farm.token1.address}
        `,
        ).toBe(true)
      }
    })
  },
  {
    timeout: 300000,
  },
)
