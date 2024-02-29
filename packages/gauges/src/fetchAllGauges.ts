import { ContractFunctionConfig, ContractFunctionResult, MulticallContracts, PublicClient } from 'viem'
import { gaugesVotingABI } from './abis/gaugesVoting'
import { getContract } from './contract'
import { fetchGaugesCount } from './fetchGaugesCount'
import { getGaugeHash } from './getGaugeHash'
import { GaugeInfo } from './types'

export const fetchAllGauges = async (
  client: PublicClient,
  options?: {
    blockNumber?: bigint
  },
): Promise<GaugeInfo[]> => {
  const contract = getContract(client)
  const counts = await fetchGaugesCount(client, options)

  const multicalls: MulticallContracts<ContractFunctionConfig<typeof gaugesVotingABI, 'gauges'>[]> = []

  for (let i = 0; i < counts; i++) {
    multicalls.push({
      ...contract,
      functionName: 'gauges',
      args: [BigInt(i)],
    } as const)
  }

  const response = (await client.multicall({
    contracts: multicalls,
    allowFailure: false,
    ...options,
  })) as ContractFunctionResult<typeof gaugesVotingABI, 'gauges'>[]

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
