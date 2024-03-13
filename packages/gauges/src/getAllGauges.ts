import { PublicClient } from 'viem'
import { CONFIG_PROD } from './constants/config/prod'
import { CONFIG_TESTNET } from './constants/config/testnet'
import { fetchAllGauges } from './fetchAllGauges'
import { fetchAllKilledGauges } from './fetchAllKilledGauges'
import { fetchAllGaugesVoting } from './fetchGaugeVoting'
import { Gauge, GaugeConfig, GaugeInfoConfig } from './types'

export type getAllGaugesOptions = {
  testnet?: boolean
  inCap?: boolean
  bothCap?: boolean
  // include killed gauges if true
  killed?: boolean
  blockNumber?: bigint
}

export const getAllGauges = async (
  client: PublicClient,
  options: getAllGaugesOptions = {
    testnet: false,
    inCap: true,
    bothCap: false,
    killed: false,
  },
): Promise<Gauge[]> => {
  const { testnet, inCap, bothCap, killed, blockNumber } = options
  const presets = testnet ? CONFIG_TESTNET : CONFIG_PROD

  const allGaugeInfos = await fetchAllGauges(client, {
    blockNumber,
  })
  let allActiveGaugeInfos = allGaugeInfos

  allActiveGaugeInfos = await fetchAllKilledGauges(client, allGaugeInfos, { blockNumber })

  if (!killed) allActiveGaugeInfos = allGaugeInfos.filter((gauge) => !gauge.killed)

  const allGaugeInfoConfigs = allActiveGaugeInfos.reduce((prev, gauge) => {
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
    const allGaugesVoting = await fetchAllGaugesVoting(client, allGaugeInfoConfigs, inCap, options)
    return allGaugesVoting
  }

  const inCapVoting = await fetchAllGaugesVoting(client, allGaugeInfoConfigs, true, options)
  const notInCapVoting = await fetchAllGaugesVoting(client, allGaugeInfoConfigs, false, options)

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
