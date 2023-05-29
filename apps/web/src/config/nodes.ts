import { ChainId } from '@pancakeswap/sdk'
import { getNodeRealUrlV2 } from 'utils/nodeReal'
import { FallbackTransportConfig } from 'viem'

export const SERVER_NODES = {
  [ChainId.BSC]: [
    process.env.NEXT_PUBLIC_NODE_PRODUCTION,
    'https://bsc-dataseed1.defibit.io',
    'https://bsc-dataseed1.binance.org',
  ].filter(Boolean),
  [ChainId.BSC_TESTNET]: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
  [ChainId.ETHEREUM]: [
    getNodeRealUrlV2(ChainId.ETHEREUM, process.env.SERVER_NODE_REAL_API_ETH),
    'https://eth.llamarpc.com',
    'https://cloudflare-eth.com',
  ],
  [ChainId.GOERLI]: [
    getNodeRealUrlV2(ChainId.GOERLI, process.env.SERVER_NODE_REAL_API_GOERLI),
    'https://eth-goerli.public.blastapi.io',
  ].filter(Boolean),
} satisfies Record<ChainId, string[]>

export const PUBLIC_NODES = {
  [ChainId.BSC]: {
    urls: [
      process.env.NEXT_PUBLIC_NODE_PRODUCTION,
      // getNodeRealUrlV2(ChainId.BSC, process.env.NEXT_PUBLIC_NODE_REAL_API_ETH),
      'https://bsc-mainnet.gateway.pokt.network/v1/lb/0559a4d874bda0ee4ebef6c7',
      'https://multi-necessary-choice.bsc.quiknode.pro/',
      'https://bsc-dataseed1.defibit.io',
      'https://bsc-dataseed1.binance.org',
    ].filter(Boolean),
    fallbackConfig: {
      rank: {
        interval: 10_000,
      },
    },
  },
  [ChainId.BSC_TESTNET]: {
    urls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
  },
  [ChainId.ETHEREUM]: {
    urls: [
      getNodeRealUrlV2(ChainId.ETHEREUM, process.env.NEXT_PUBLIC_NODE_REAL_API_ETH),
      'https://little-quick-brook.quiknode.pro/74f7f03cbdc91e54f2ed689df3fc500e6bc5b4e7/',
      'https://eth-mainnet.gateway.pokt.network/v1/lb/0559a4d874bda0ee4ebef6c7',
      // 'https://eth.llamarpc.com',
    ].filter(Boolean),
    fallbackConfig: {
      rank: {
        interval: 10_000,
      },
    },
  },
  [ChainId.GOERLI]: {
    urls: [
      getNodeRealUrlV2(ChainId.GOERLI, process.env.NEXT_PUBLIC_NODE_REAL_API_GOERLI),
      'https://eth-goerli.public.blastapi.io',
    ].filter(Boolean),
  },
} satisfies Record<
  ChainId,
  {
    urls: string[]
    fallbackConfig?: FallbackTransportConfig
  }
>
