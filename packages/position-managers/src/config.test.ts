import { chainNames } from '@pancakeswap/chains'
import { Token } from '@pancakeswap/sdk'
import difference from 'lodash/difference.js'
import groupBy from 'lodash/groupBy.js'
import uniqBy from 'lodash/uniqBy.js'
import { PublicClient, createPublicClient, http, parseAbiItem } from 'viem'
import * as CHAINS from 'viem/chains'
import { describe, expect, it } from 'vitest'
import { SUPPORTED_CHAIN_IDS, VAULTS_CONFIG_BY_CHAIN } from './constants'

const publicClient = Object.keys(VAULTS_CONFIG_BY_CHAIN).reduce((acc, chainId) => {
  return {
    ...acc,
    [chainId]: createPublicClient({
      chain: Object.values(CHAINS).find((chain) => chain.id === Number(chainId)),
      transport: http(),
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
    describe(`chain ${chainNames[chainId]}`, () => {
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

      describe.concurrent(
        `vaults config for chain ${chainNames[chainId]}`,
        () => {
          it.each(vaults)('should have correct adapter address for $address', async (vault) => {
            const adapterAddress = await publicClient[chainId].readContract({
              address: vault.address,
              abi: [parseAbiItem('function adapterAddr() view returns (address)')],
              functionName: 'adapterAddr',
            })
            expect(adapterAddress).toBe(vault.adapterAddress)
          })
          it.each(vaults)('should have correct earningToken address for $address', async (vault) => {
            const earningTokenAddress = await publicClient[chainId].readContract({
              address: vault.address,
              abi: [parseAbiItem('function rewardToken() view returns (address)')],
              functionName: 'rewardToken',
            })
            expect(earningTokenAddress).toBe((vault.earningToken as Token).address)
          })
          it.each(vaults)('should have correct pool config for adapterAddress $address', async (vault) => {
            const [poolAddress, token0Address, token1Address] = await publicClient[chainId].multicall({
              contracts: [
                {
                  abi: [parseAbiItem('function pool() view returns (address)')],
                  address: vault.adapterAddress,
                  functionName: 'pool',
                },
                {
                  abi: [parseAbiItem('function token0() view returns (address)')],
                  address: vault.adapterAddress,
                  functionName: 'token0',
                },
                {
                  abi: [parseAbiItem('function token1() view returns (address)')],
                  address: vault.adapterAddress,
                  functionName: 'token1',
                },
              ],
              allowFailure: false,
            })
            const fee = await publicClient[chainId].readContract({
              address: poolAddress,
              abi: [parseAbiItem('function fee() view returns (uint24)')],
              functionName: 'fee',
            })
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

          it.each(vaults)('should have correct vaultAddress for $address', async (vault) => {
            const vaultAddress = await publicClient[chainId].readContract({
              address: vault.adapterAddress,
              abi: [parseAbiItem('function vault() view returns (address)')],
              functionName: 'vault',
            })
            expect(vaultAddress).toBe(vault.vaultAddress)
          })
        },
        {
          timeout: 30_000,
        },
      )
    })
  })
})
