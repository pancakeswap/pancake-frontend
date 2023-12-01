import { ContractFunctionConfig, ContractFunctionResult, MulticallContracts, PublicClient } from 'viem'
import { gaugesVotingABI } from './abis/gaugesVoting'
import { getCalcContract } from './contract'
import { GaugeInfo, GaugeVotingInfo } from './types'

export const fetchAllGaugesVoting = async (
  client: PublicClient,
  gaugeInfos: GaugeInfo[],
  inCap: boolean = true,
): Promise<GaugeVotingInfo[]> => {
  const contract = getCalcContract(client)

  const multicalls: MulticallContracts<ContractFunctionConfig<typeof gaugesVotingABI, 'getGaugeWeight'>[]> =
    gaugeInfos.map((gauge) => {
      return {
        ...contract,
        functionName: 'getGaugeWeight',
        args: [gauge.pairAddress, BigInt(gauge.chainId), inCap],
      }
    })

  const response = (await client.multicall({
    contracts: multicalls,
    allowFailure: false,
  })) as ContractFunctionResult<typeof gaugesVotingABI, 'getGaugeWeight'>[]

  return gaugeInfos.map((gauge, index) => ({
    ...gauge,
    weight: response[index] || 0n,
  }))
}
