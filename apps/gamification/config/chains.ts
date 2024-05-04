import { ChainId, chainNames } from '@pancakeswap/chains'
import memoize from 'lodash/memoize'
import {
  Chain,
  arbitrum,
  arbitrumGoerli,
  arbitrumSepolia,
  base,
  baseGoerli,
  baseSepolia,
  bscTestnet,
  bsc as bsc_,
  zkSync,
} from 'wagmi/chains'

export const CHAIN_QUERY_NAME = chainNames

const CHAIN_QUERY_NAME_TO_ID = Object.entries(CHAIN_QUERY_NAME).reduce((acc, [chainId, chainName]) => {
  return {
    [chainName.toLowerCase()]: chainId as unknown as ChainId,
    ...acc,
  }
}, {} as Record<string, ChainId>)

export const getChainId = memoize((chainName: string) => {
  if (!chainName) return undefined
  return CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] ? +CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] : undefined
})

const bsc = {
  ...bsc_,
  rpcUrls: {
    ...bsc_.rpcUrls,
    public: {
      ...bsc_.rpcUrls,
      http: ['https://bsc-dataseed.binance.org/'],
    },
    default: {
      ...bsc_.rpcUrls.default,
      http: ['https://bsc-dataseed.binance.org/'],
    },
  },
} satisfies Chain

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS: ChainId[] = [
  ChainId.ARBITRUM_ONE,
  ChainId.ARBITRUM_GOERLI,
  ChainId.POLYGON_ZKEVM,
  ChainId.POLYGON_ZKEVM_TESTNET,
  ChainId.ZKSYNC,
  ChainId.ZKSYNC_TESTNET,
  ChainId.LINEA_TESTNET,
  ChainId.LINEA,
  ChainId.BASE,
  ChainId.BASE_TESTNET,
  ChainId.OPBNB,
  ChainId.OPBNB_TESTNET,
  ChainId.ARBITRUM_SEPOLIA,
  ChainId.BASE_SEPOLIA,
]

export const CHAINS: [Chain, ...Chain[]] = [
  bsc,
  bscTestnet,
  // mainnet,
  // goerli,
  // sepolia,
  // polygonZkEvm,
  // polygonZkEvmTestnet,
  zkSync,
  arbitrum,
  arbitrumGoerli,
  arbitrumSepolia,
  // linea,
  // lineaTestnet,
  base,
  baseGoerli,
  baseSepolia,
  // opBNB,
  // opBNBTestnet,
  // scrollSepolia,
]
