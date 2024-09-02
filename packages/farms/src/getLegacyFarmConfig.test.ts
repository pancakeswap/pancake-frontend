import difference from 'lodash/difference'
import orderBy from 'lodash/orderBy'
import { describe, expect, it } from 'vitest'
import { getFarmConfig } from '../constants'
import { farmsV3ConfigChainMap, legacyFarmsV3ConfigChainMap } from '../constants/v3'
import { supportedChainIdV3, supportedChainIdV4 } from './const'
import { getLegacyFarmConfig } from './getLegacyFarmConfig'

describe('getLegacyFarmConfig', async () => {
  it('should have same supported chainId', () => {
    expect(difference(supportedChainIdV4, supportedChainIdV3)).toStrictEqual([])
  })

  for await (const chainId of supportedChainIdV4) {
    it(`should have same farm config for chainId ${chainId}`, async () => {
      const legacyFarmConfig = await getLegacyFarmConfig(chainId)
      const farmConfig = (await getFarmConfig(chainId)) ?? []

      expect(legacyFarmConfig.length, `${chainId}`).toEqual(farmConfig?.length)
      const orderedLegacyFarmConfig = orderBy(legacyFarmConfig, 'pid')
      const orderedFarmConfig = orderBy(farmConfig, 'pid')

      orderedFarmConfig.forEach((farm, index) => {
        const config = orderedLegacyFarmConfig[index]
        expect(farm.lpAddress, `${chainId}:${farm.pid}`).toEqual(config.lpAddress)
        const [token0, token1] =
          farm.token.address.toLowerCase() < farm.quoteToken.address.toLowerCase()
            ? [farm.token, farm.quoteToken]
            : [farm.quoteToken, farm.token]
        const [configToken0, configToken1] =
          config.token.address.toLowerCase() < config.quoteToken.address.toLowerCase()
            ? [config.token, config.quoteToken]
            : [config.quoteToken, config.token]
        expect(token0.address, `${chainId}:${farm.pid}`).toEqual(configToken0.address)
        expect(token1.address, `${chainId}:${farm.pid}`).toEqual(configToken1.address)
        expect(farm.pid, `${chainId}:${farm.pid}`).toEqual(config.pid)
        expect(farm.vaultPid, `${chainId}:${farm.pid}`).toEqual(config.vaultPid)
        expect(farm.boosted, `${chainId}:${farm.pid}`).toEqual(config.boosted)
        expect(farm.v1pid, `${chainId}:${farm.pid}`).toEqual(config.v1pid)
      })
    })
  }
})

it('legacy v3 farm config', () => {
  for (const [chainId, config] of Object.entries(legacyFarmsV3ConfigChainMap)) {
    expect(farmsV3ConfigChainMap[chainId as unknown as keyof typeof farmsV3ConfigChainMap]).toStrictEqual(config)
  }
  // expect(legacyFarmsV3ConfigChainMap).toStrictEqual(farmsV3ConfigChainMap)
})
