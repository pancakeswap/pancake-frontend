import { GetContractReturnType, PublicClient, getContract as getContractInstance } from 'viem'
import { calcGaugesVotingABI, gaugesVotingABI } from './abis'
import { GAUGES_ADDRESS, GAUGES_CALC_ADDRESS } from './constants/address'

export const getContract = (client: PublicClient): GetContractReturnType<typeof gaugesVotingABI, PublicClient> => {
  const chainId = client.chain?.id

  if (!chainId || !Object.keys(GAUGES_ADDRESS).includes(String(chainId))) {
    throw new Error(`Invalid client chain ${client.chain?.id}`)
  }

  return getContractInstance({
    address: GAUGES_ADDRESS[chainId as keyof typeof GAUGES_ADDRESS],
    abi: gaugesVotingABI,
    client,
  })
}

export const getCalcContract = (
  client: PublicClient,
): GetContractReturnType<typeof calcGaugesVotingABI, PublicClient> => {
  const chainId = client.chain?.id

  if (!chainId || !Object.keys(GAUGES_CALC_ADDRESS).includes(String(chainId))) {
    throw new Error(`Invalid client chain ${client.chain?.id}`)
  }

  return getContractInstance({
    address: GAUGES_CALC_ADDRESS[chainId as keyof typeof GAUGES_CALC_ADDRESS],
    abi: calcGaugesVotingABI,
    client,
  })
}
