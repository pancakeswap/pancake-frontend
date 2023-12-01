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
    address: '0xa2BAbe69700414BB0342ba0615Ff4B1965d6D36f',
    abi: gaugesVotingABI,
    publicClient: client,
  })
}
