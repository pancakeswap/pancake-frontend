import { chainNames } from '@pancakeswap/chains'
import { VAULTS_CONFIG_BY_CHAIN } from '@pancakeswap/position-managers'
import { FACTORY_ADDRESS_MAP, Token, computePairAddress } from '@pancakeswap/sdk'
import { DEPLOYER_ADDRESSES, computePoolAddress } from '@pancakeswap/v3-sdk'
import groupBy from 'lodash/groupBy'
import { PublicClient, createPublicClient, http, parseAbiItem } from 'viem'
import * as CHAINS from 'viem/chains'
import { describe, expect, it, test } from 'vitest'
import { CONFIG_PROD } from '../constants/config/prod'
import { GaugeStableSwapConfig, GaugeType } from '../types'

describe('Gauges Config', async () => {
  const gidGroups = groupBy(CONFIG_PROD, 'gid')
  const chainIdGroups = groupBy(CONFIG_PROD, 'chainId')
  const publicClient = Object.keys(chainIdGroups).reduce((acc, chainId) => {
    return {
      ...acc,
      [chainId]: createPublicClient({
        chain: Object.values(CHAINS).find((chain) => chain.id === Number(chainId)),
        transport: http(),
      }) as PublicClient,
    }
  }, {} as Record<string, PublicClient>)

  Object.entries(gidGroups).forEach(([gid, gauge]) => {
    it(`gauges with gid #${gid} should be unique`, () => {
      expect(gauge.length).toBe(1)
    })
  })
  let index = 0
  CONFIG_PROD.forEach((gauge) => {
    const chainName = chainNames[gauge.chainId]
    it(`${chainName} gid #${gauge.gid} should follow the index`, () => {
      expect(gauge.gid).toBe(index)
      if (gauge.gid === index) index++
    })
  })

  const stableSwapGauges = Object.entries(chainIdGroups).reduce((acc, [chainId, gauges]) => {
    const _stableSwapGauges = gauges.filter(
      (gauge) => gauge.type === GaugeType.StableSwap && !gauge.killed,
    ) as GaugeStableSwapConfig[]
    if (_stableSwapGauges.length === 0) return acc
    return {
      ...acc,
      [chainId]: _stableSwapGauges,
    }
  }, {} as Record<string, GaugeStableSwapConfig[]>)
  Object.entries(stableSwapGauges).forEach(([chainId, gauges]) => {
    describe(`chainId ${chainId} stableSwap gauges address should be LP address`, async () => {
      const minters = await publicClient[chainId].multicall({
        contracts: gauges.map((gauge) => ({
          abi: [parseAbiItem('function minter() view returns (address)')],
          address: gauge.address,
          functionName: 'minter',
        })),
        allowFailure: false,
      })

      expect(minters.length).toBe(gauges.length)

      const stableSwapCoins = await publicClient[chainId].multicall({
        contracts: minters.map((minter) => ({
          abi: [parseAbiItem('function N_COINS() view returns (uint256)')],
          address: minter,
          functionName: 'N_COINS',
        })),
        allowFailure: false,
      })

      expect(stableSwapCoins.length).toBe(gauges.length)
      expect(stableSwapCoins.every((c) => c >= 2n)).toBe(true)

      stableSwapCoins.forEach((coins, idx) => {
        test(`stableSwap gauge #${gauges[idx].gid} should have correct N_COINS`, () => {
          expect(Number(coins)).toBe(gauges[idx].tokenAddresses.length)
        })
      })
    })
  })

  CONFIG_PROD.forEach((gauge) => {
    const chainName = chainNames[gauge.chainId]
    it(`${chainName} gid #${gauge.gid} tokens chainId-lpAddress-feeTier should be matched`, () => {
      if (gauge.type === GaugeType.V3) {
        const tokenA = new Token(gauge.chainId, gauge.token0Address, 18, '')
        const tokenB = new Token(gauge.chainId, gauge.token1Address, 18, '')
        const computedAddress = computePoolAddress({
          deployerAddress: DEPLOYER_ADDRESSES[gauge.chainId],
          tokenA,
          tokenB,
          fee: gauge.feeTier,
        })
        expect(computedAddress).toBe(gauge.address)
      }

      if (gauge.type === GaugeType.V2) {
        const tokenA = new Token(gauge.chainId, gauge.token0Address, 18, '')
        const tokenB = new Token(gauge.chainId, gauge.token1Address, 18, '')
        const computedAddress = computePairAddress({
          factoryAddress: FACTORY_ADDRESS_MAP[gauge.chainId],
          tokenA,
          tokenB,
        })
        expect(gauge.address).toBe(computedAddress)
      }
    })

    if (gauge.type === GaugeType.ALM) {
      const vaults = VAULTS_CONFIG_BY_CHAIN[Number(gauge.chainId) as keyof typeof VAULTS_CONFIG_BY_CHAIN]
      const matchedVault = vaults.find((v) => v.vaultAddress === gauge.address)
      // it(`${chainName} gid #${gauge.gid} ALM address ${gauge.address} should have already configured in position-managers`, () => {
      //   expect(matchedVault).toBeDefined()
      // })
      it(`${chainName} gid #${gauge.gid} ALM address ${gauge.address} should have correct position manager name`, () => {
        if (!matchedVault) {
          expect(gauge.managerName).toBeDefined()
        } else {
          expect(matchedVault).toBeDefined()
          expect(gauge.managerName).toBeUndefined()
        }
      })
    }
  })
})
