import { PublicClient } from 'viem'
import { CONFIG_PROD, CONFIG_TESTNET } from './constants/config'
import { fetchAllGauges } from './fetchAllGauges'
import { fetchAllGaugesVoting } from './fetchGaugeVoting'
import { Gauge } from './types'

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

  if (!bothCap) {
    const allGaugesVoting = await fetchAllGaugesVoting(client, allGaugeInfos, inCap)
    return allGaugesVoting.reduce((prev, gauge) => {
      const preset = presets.find((p) => p.address === gauge.pairAddress && Number(p.chainId) === gauge.chainId)

      if (!preset) return prev

      return [
        ...prev,
        {
          ...gauge,
          ...preset,
        },
      ]
    }, [] as Gauge[])
  }
  const inCapVoting = await fetchAllGaugesVoting(client, allGaugeInfos, true)
  const notInCapVoting = await fetchAllGaugesVoting(client, allGaugeInfos, false)

  return inCapVoting.reduce((prev, inCapGauge) => {
    const preset = presets.find((p) => p.address === inCapGauge.pairAddress && Number(p.chainId) === inCapGauge.chainId)
    const notInCapGauge = notInCapVoting.find((p) => p.hash === inCapGauge.hash)
    if (!preset) return prev

    return [
      ...prev,
      {
        ...preset,
        ...inCapGauge,
        weight: 0n,
        inCapWeight: inCapGauge.weight,
        notInCapWeight: notInCapGauge?.weight,
      },
    ]
  }, [] as Gauge[])
}
