import { CONFIG_PROD, CONFIG_TESTNET } from './constants/config'
import { publicClient, testnetPublicClient } from './contract'
import { fetchAllGauges } from './fetchAllGauges'
import { fetchAllGaugesVoting } from './fetchGaugeVoting'
import { Gauge } from './types'

export type getAllGaugesOptions = {
  testnet?: boolean
}

export const getAllGauges = async (
  options: getAllGaugesOptions = {
    testnet: false,
  },
): Promise<Gauge[]> => {
  const { testnet } = options
  const client = testnet ? testnetPublicClient : publicClient
  const presets = testnet ? CONFIG_TESTNET : CONFIG_PROD

  const allGaugeInfos = await fetchAllGauges(client)
  const allGaugesVoting = await fetchAllGaugesVoting(client, allGaugeInfos)

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
