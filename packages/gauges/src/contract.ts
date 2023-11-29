import { GetContractReturnType, PublicClient, createPublicClient, getContract as getContractInstance, http } from 'viem'
import { bsc, bscTestnet } from 'viem/chains'
import { gaugesVotingABI } from './abis/gaugesVoting'
import GAUGES_ADDRESS from './constants/address'

export const publicClient: PublicClient = createPublicClient({
  chain: bsc,
  transport: http(),
})

export const testnetPublicClient: PublicClient = createPublicClient({
  chain: bscTestnet,
  transport: http('https://data-seed-prebsc-1-s1.binance.org:8545'),
})

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
