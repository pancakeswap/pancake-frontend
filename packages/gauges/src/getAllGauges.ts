import { PublicClient } from 'viem'
import { CONFIG_PROD, CONFIG_TESTNET } from './constants/config'
import { fetchAllGauges } from './fetchAllGauges'
import { fetchAllGaugesVoting } from './fetchGaugeVoting'
import { Gauge } from './types'

export type getAllGaugesOptions = {
  testnet?: boolean
  inCap?: boolean
}

export const getAllGauges = async (
  client: PublicClient,
  options: getAllGaugesOptions = {
    testnet: false,
    inCap: true,
  },
): Promise<Gauge[]> => {
  const { testnet, inCap } = options
  const presets = testnet ? CONFIG_TESTNET : CONFIG_PROD

  const allGaugeInfos = await fetchAllGauges(client)
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
