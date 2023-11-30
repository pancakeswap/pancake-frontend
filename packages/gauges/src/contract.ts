import {
  GetContractReturnType,
  PublicClient,
  createPublicClient,
  fallback,
  getContract as getContractInstance,
  http,
} from 'viem'
import { bsc, bscTestnet } from 'viem/chains'
import { gaugesVotingABI } from './abis/gaugesVoting'
import GAUGES_ADDRESS from './constants/address'

export const publicClient: PublicClient = createPublicClient({
  chain: bsc,
  transport: fallback(
    ['https://bsc.publicnode.com', 'https://bsc-dataseed1.defibit.io', 'https://bsc-dataseed1.binance.org'].map((url) =>
      http(url),
    ),
    {
      rank: true,
    },
  ),
})

export const testnetPublicClient: PublicClient = createPublicClient({
  chain: bscTestnet,
  transport: fallback(
    ['https://data-seed-prebsc-1-s1.binance.org:8545', 'https://bsc-testnet.publicnode.com'].map((url) => http(url)),
    {
      rank: true,
    },
  ),
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
