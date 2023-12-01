import { ChainId } from '@pancakeswap/chains'
import { GetContractReturnType, PublicClient, getContract as getContractInstance } from 'viem'
import { gaugesVotingABI } from './abis/gaugesVoting'
import { GAUGES_ADDRESS } from './constants/address'

export const getContract = (client: PublicClient): GetContractReturnType<typeof gaugesVotingABI, PublicClient> => {
  const chainId = client.chain?.id

  if (!chainId || !Object.keys(GAUGES_ADDRESS).includes(String(chainId))) {
    throw new Error(`Invalid client chain ${client.chain?.id}`)
  }

  return getContractInstance({
    address: GAUGES_ADDRESS[chainId as keyof typeof GAUGES_ADDRESS],
    abi: gaugesVotingABI,
    publicClient: client,
  })
}

export const getCalcContract = (client: PublicClient): GetContractReturnType<typeof gaugesVotingABI, PublicClient> => {
  const chainId = client.chain?.id

  if (!chainId || chainId !== ChainId.BSC) {
    throw new Error(`Invalid client chain ${client.chain?.id}`)
  }

  return getContractInstance({
    address: '0xbf9b99071efAb72e6F4a05c626A911F3528e013e',
    abi: gaugesVotingABI,
    publicClient: client,
  })
}
