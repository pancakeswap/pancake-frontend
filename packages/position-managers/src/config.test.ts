import { ChainId, chainNames } from '@pancakeswap/chains'
import { Token } from '@pancakeswap/sdk'
import difference from 'lodash/difference.js'
import groupBy from 'lodash/groupBy.js'
import uniqBy from 'lodash/uniqBy.js'
import { Address, PublicClient, createPublicClient, fallback, http, parseAbiItem } from 'viem'
import * as CHAINS from 'viem/chains'
import { describe, expect, it } from 'vitest'
import { SUPPORTED_CHAIN_IDS, VAULTS_CONFIG_BY_CHAIN } from './constants'

const PUBLIC_NODES = {
  [ChainId.ARBITRUM_ONE]: [
    CHAINS.arbitrum.rpcUrls.default,
    'https://arbitrum-one.publicnode.com',
    'https://arbitrum.llamarpc.com',
  ],
}

const publicClient = Object.keys(VAULTS_CONFIG_BY_CHAIN).reduce((acc, chainId) => {
  return {
    ...acc,
    [chainId]: createPublicClient({
      chain: Object.values(CHAINS).find((chain) => chain.id === Number(chainId)),
      transport: PUBLIC_NODES[chainId] ? fallback(PUBLIC_NODES[chainId].map((rpc: string) => http(rpc))) : http(),
    }) as PublicClient,
  }
}, {} as Record<string, PublicClient>)

describe('position manager config', () => {
  const chainIds = Object.keys(VAULTS_CONFIG_BY_CHAIN).map(Number)

  const expectUnique = <T>(arr: Array<T>, key: string, message?: string) => {
    const unique = uniqBy(arr, key)
    const diff = difference(arr, unique)
    expect(
      diff.length,
      `${message || ''}
    expected all ${key} to be unique, but found duplicates: ${diff.map((item) => item[key]).join(', ')}
    `,
    ).toBe(0)
  }

  it('should have vaults config for all supported chains', () => {
    expect(chainIds.sort()).toEqual([...SUPPORTED_CHAIN_IDS].sort())
  })

  Object.entries(VAULTS_CONFIG_BY_CHAIN).forEach(([chainId, vaults]) => {
    describe(`chain ${chainNames[chainId]}`, async () => {
      it(`should have correct token for specified chain ${chainNames[chainId]}`, () => {
        vaults.forEach((vault) => {
          expect(vault.currencyA.chainId).toBe(Number(chainId))
          expect(vault.currencyB.chainId).toBe(Number(chainId))
          expect(vault.earningToken.chainId).toBe(Number(chainId))
        })
      })

      it(`should have unique vault id for specified chain ${chainNames[chainId]}`, () => {
        expectUnique(vaults, 'id')
        Object.entries(groupBy(vaults, 'manager')).forEach(([manager, vaultsByManager]) => {
          expectUnique(vaultsByManager, 'idByManager', manager)
        })
        expectUnique(vaults, 'address')
        expectUnique(vaults, 'adapterAddress')

        // vaultAddress is not unique
        // expectUnique(vaults, 'vaultAddress')
      })

      const getAdapterAddresses = await publicClient[chainId].multicall({
        contracts: vaults.map((vault) => ({
          address: vault.address,
          abi: [parseAbiItem('function adapterAddr() view returns (address)')],
          functionName: 'adapterAddr',
        })),
        allowFailure: false,
      })
      const getEarningTokenAddresses = await publicClient[chainId].multicall({
        contracts: vaults.map((vault) => ({
          address: vault.address,
          abi: [parseAbiItem('function rewardToken() view returns (address)')],
          functionName: 'rewardToken',
        })),
        allowFailure: false,
      })
      const getPoolAddresses = (await publicClient[chainId].multicall({
        contracts: vaults
          .map((vault) => {
            return [
              {
                address: vault.adapterAddress,
                abi: [parseAbiItem('function pool() view returns (address)')],
                functionName: 'pool',
              },
              {
                address: vault.adapterAddress,
                abi: [parseAbiItem('function token0() view returns (address)')],
                functionName: 'token0',
              },
              {
                address: vault.adapterAddress,
                abi: [parseAbiItem('function token1() view returns (address)')],
                functionName: 'token1',
              },
            ]
          })
          .flat(),
        allowFailure: false,
      })) as Address[]
      const getVaultAddresses = await publicClient[chainId].multicall({
        contracts: vaults.map((vault) => ({
          address: vault.adapterAddress,
          abi: [parseAbiItem('function vault() view returns (address)')],
          functionName: 'vault',
        })),
        allowFailure: false,
      })
      const [adapterAddresses, earningTokenAddresses, poolAddresses, vaultAddresses] = await Promise.all([
        getAdapterAddresses,
        getEarningTokenAddresses,
        getPoolAddresses,
        getVaultAddresses,
      ])
      const fees = await publicClient[chainId].multicall({
        contracts: poolAddresses
          .filter((_, index) => {
            return index % 3 === 0
          })
          .map((address) => ({
            address,
            abi: [parseAbiItem('function fee() view returns (uint24)')],
            functionName: 'fee',
          })),
        allowFailure: false,
      })

      vaults.forEach((vault, index) => {
        it(`should have correct adapter address for ${vault.address}`, async () => {
          const adapterAddress = adapterAddresses[index]
          expect(adapterAddress).toBe(vault.adapterAddress)
        })

        it(`should have correct earningToken address for ${vault.address}`, async () => {
          const earningTokenAddress = earningTokenAddresses[index]
          expect(earningTokenAddress).toBe((vault.earningToken as Token).address)
        })

        it(`should have correct pool config for adapterAddress ${vault.address}`, async () => {
          const [_, token0Address, token1Address] = poolAddresses.slice(index * 3, index * 3 + 3)
          const fee = fees[index]
          expect(
            vault.currencyA.isToken ? vault.currencyA.address : '0x',
            "Expected 'currencyA' address to be the same as the value from the smart contract",
          ).toBe(token0Address)
          expect(
            vault.currencyB.isToken ? vault.currencyB.address : '0x',
            "Expected 'currencyB' address to be the same as the value from the smart contract",
          ).toBe(token1Address)
          expect(vault.feeTier, "Expected 'feeTier' to be the same as the value from the smart contract").toBe(fee)
        })

        it(`should have correct vaultAddress for ${vault.address}`, async () => {
          const vaultAddress = vaultAddresses[index]
          expect(vaultAddress).toBe(vault.vaultAddress)
        })
      })
    })
  })
})
