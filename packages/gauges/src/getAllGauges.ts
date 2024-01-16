import { PublicClient } from 'viem'
import { CONFIG_PROD } from './constants/config/prod'
import { CONFIG_TESTNET } from './constants/config/testnet'
import { fetchAllGauges } from './fetchAllGauges'
import { fetchAllGaugesVoting } from './fetchGaugeVoting'
import { Gauge, GaugeConfig, GaugeInfoConfig } from './types'

export type getAllGaugesOptions = {
  testnet?: boolean
  inCap?: boolean
  bothCap?: boolean
}

export const getAllGauges = async (
  client: PublicClient,
  options: getAllGaugesOptions = {
    testnet: false,
    inCap: true,
    bothCap: false,
  },
): Promise<Gauge[]> => {
  const { testnet, inCap, bothCap } = options
  const presets = testnet ? CONFIG_TESTNET : CONFIG_PROD

  const allGaugeInfos = await fetchAllGauges(client)
  const allGaugeInfoConfigs = allGaugeInfos.reduce((prev, gauge) => {
    const filters = presets.filter((p) => p.address === gauge.pairAddress && Number(p.chainId) === gauge.chainId)
    let preset: GaugeConfig

    if (!filters.length) return prev
    if (filters.length > 1) {
      preset = filters[filters.length - 1]
    } else {
      preset = filters[0]
    }

    return [
      ...prev,
      {
        ...preset,
        ...gauge,
      },
    ]
  }, [] as GaugeInfoConfig[])

  if (!bothCap) {
    const allGaugesVoting = await fetchAllGaugesVoting(client, allGaugeInfoConfigs, inCap)
    return allGaugesVoting
  }

  const inCapVoting = await fetchAllGaugesVoting(client, allGaugeInfoConfigs, true)
  const notInCapVoting = await fetchAllGaugesVoting(client, allGaugeInfoConfigs, false)

  return inCapVoting.reduce((prev, inCapGauge) => {
    const notInCapGauge = notInCapVoting.find((p) => p.hash === inCapGauge.hash)

    return [
      ...prev,
      {
        ...inCapGauge,
        weight: 0n,
        inCapWeight: inCapGauge.weight,
        notInCapWeight: notInCapGauge?.weight,
      },
    ]
  }, [] as Gauge[])
}
