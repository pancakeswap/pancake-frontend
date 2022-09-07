import { bsc, fantomOpera, avalandche } from '@pancakeswap/wagmi/chains'
import { mainnet, arbitrum, optimism, polygon } from 'wagmi/chains'

// Chain Id is defined by Stargate
const stargateNetowrk = [
  {
    chainId: 101,
    name: 'Ethereum',
    chain: mainnet,
  },
  {
    name: 'BNB Chain',
    chainId: 102,
    chain: bsc,
  },
  {
    chainId: 109,
    name: 'Matic',
    chain: polygon,
  },
  {
    chainId: 106,
    name: 'Avalanche',
    chain: avalandche,
  },
  {
    chainId: 112,
    name: 'Fantom',
    chain: fantomOpera,
  },
  {
    chainId: 110,
    name: 'Arbitrum',
    chain: arbitrum,
  },
  {
    chainId: 111,
    name: 'Optimism',
    chain: optimism,
  },
]

export const findChainByStargateId = (chainId: number) => stargateNetowrk.find((s) => s.chainId === chainId)
