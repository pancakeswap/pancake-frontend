import { chainNames } from '@pancakeswap/chains'
import { FACTORY_ADDRESS_MAP, Token, computePairAddress } from '@pancakeswap/sdk'
import { DEPLOYER_ADDRESSES, computePoolAddress } from '@pancakeswap/v3-sdk'
import groupBy from 'lodash/groupBy'
import { describe, expect, it } from 'vitest'
import { CONFIG_PROD } from '../constants/config/prod'
import { GaugeType } from '../types'

describe('Gauges Config', () => {
  const chainName = chainNames[1]

  const gidGroups = groupBy(CONFIG_PROD, 'gid')
  Object.entries(gidGroups).forEach(([gid, gauge]) => {
    it(`${chainName} gauges with gid #${gid} should be unique`, () => {
      expect(gauge.length).toBe(1)
    })
  })
  let index = 0
  CONFIG_PROD.forEach((gauge) => {
    it(`${chainName} gid #${gauge.gid} should follow the index`, () => {
      expect(gauge.gid).toBe(index)
      if (gauge.gid === index) index++
    })
  })

  CONFIG_PROD.forEach((gauge) => {
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
  })
})
