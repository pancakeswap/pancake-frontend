import { chainNames } from '@pancakeswap/chains'
import { VAULTS_CONFIG_BY_CHAIN } from '@pancakeswap/position-managers'
import { FACTORY_ADDRESS_MAP, Token, computePairAddress } from '@pancakeswap/sdk'
import { DEPLOYER_ADDRESSES, computePoolAddress } from '@pancakeswap/v3-sdk'
import groupBy from 'lodash/groupBy'
import { describe, expect, it } from 'vitest'
import { CONFIG_PROD } from '../constants/config/prod'
import { GaugeType } from '../types'

describe('Gauges Config', () => {
  const gidGroups = groupBy(CONFIG_PROD, 'gid')
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
