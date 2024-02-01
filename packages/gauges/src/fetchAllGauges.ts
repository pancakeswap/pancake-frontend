import { PublicClient } from 'viem'
import { getContract } from './contract'
import { fetchGaugesCount } from './fetchGaugesCount'
import { getGaugeHash } from './getGaugeHash'
import { GaugeInfo } from './types'

export const fetchAllGauges = async (client: PublicClient): Promise<GaugeInfo[]> => {
  const contract = getContract(client)
  const counts = await fetchGaugesCount(client)

  const response = await client.multicall({
    contracts: Array.from({ length: counts }).map(
      (_, i) =>
        ({
          ...contract,
          functionName: 'gauges',
          args: [BigInt(i)],
        } as const),
    ),
    allowFailure: false,
  })

  return response.reduce((prev, curr) => {
    const [pid, masterChef, chainId, pairAddress, boostMultiplier, maxVoteCap] = curr
    return [
      ...prev,
      {
        pid: Number(pid),
        hash: getGaugeHash(pairAddress, Number(chainId)),
        pairAddress,
        masterChef,
        chainId: Number(chainId),
        boostMultiplier: Number(boostMultiplier),
        maxVoteCap: Number(maxVoteCap),
      },
    ]
  }, [] as GaugeInfo[])
}
