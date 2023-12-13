import { ChainId, chainNames } from '@pancakeswap/chains'
import memoize from 'lodash/memoize'
import {
  bsc as bsc_,
  bscTestnet,
  goerli,
  mainnet,
  zkSync,
  zkSyncTestnet,
  polygonZkEvmTestnet,
  polygonZkEvm,
  lineaTestnet,
  arbitrum,
  arbitrumGoerli,
  base,
  baseGoerli,
  scrollSepolia,
  opBNBTestnet,
  linea,
  opBNB,
  Chain,
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
      ...bsc_.rpcUrls.public,
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
]

export const CHAINS = [
  bsc,
  mainnet,
  bscTestnet,
  goerli,
  polygonZkEvm,
  polygonZkEvmTestnet,
  zkSync,
  zkSyncTestnet,
  arbitrum,
  arbitrumGoerli,
  linea,
  lineaTestnet,
  arbitrumGoerli,
  arbitrum,
  base,
  baseGoerli,
  opBNB,
  opBNBTestnet,
  scrollSepolia,
]
